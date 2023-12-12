import { In } from 'typeorm'
import { Throttle } from '@nestjs/throttler'
import { getQuery } from 'src/utils/query'
import { IsLogin } from 'src/guards/login.guard'
import type { Desktop } from 'src/entities/desktop'
import { DesktopIdDto } from 'src/dto/id/desktop.dto'
import { QueryDto, QueryResDto } from 'src/dto/query.dto'
import { HasPermission } from 'src/guards/permission.guard'
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common'
import { DesktopQueueHistoryStatus, DesktopQueueStatus, ErrorCode, PermissionType } from 'zjf-types'
import { VerifiedRequiredToken } from 'src/guards/verify-required-token.guard'

import { NotifyService } from '../notify/notify.service'
import { DesktopService } from './desktop.service'
import { DesktopResDto } from './dto/desktop.res.dto'
import { CreateDesktopBodyDto } from './dto/create-desktop.body.dto'
import { UpdateDesktopBodyDto } from './dto/update-desktop.body.dto'
import { AssignDesktopParamDto } from './dto/assign-desktop.param.dto'
import { DesktopRequestService } from './desktop-request/desktop-request.service'
import { DesktopQueueHistoryService } from './desktop-queue-history/desktop-queue-history.service'
import { ZstackService } from './zstack/zstack.service'

@ApiTags('Desktop | 云桌面')
@Controller('desktop')
export class DesktopController {
  constructor(
    private readonly _notifySrv: NotifyService,
    private readonly _desktopSrv: DesktopService,
    private readonly _desktopReqSrv: DesktopRequestService,
    private readonly _desktopHisSrv: DesktopQueueHistoryService,
    private readonly _zstackSrv: ZstackService,
  ) {}

  @ApiOperation({ summary: '判断当前客户端是否在云桌面内使用' })
  @Get('is')
  public async isDesktop(@Req() req: FastifyRequest) {
    const ip = req.raw.ip
    return await this._desktopSrv.repo().exist({ where: { internalIp: ip } })
  }

  @ApiOperation({ summary: '创建一个云桌面' })
  @Throttle(10000, 60)
  @HasPermission(PermissionType.DESKTOP_CREATE)
  @Put()
  public async createDesktop(@Body() body: CreateDesktopBodyDto) {
    try {
      return await this._desktopSrv.createDesktop(body)
    }
    catch (err) {
      const sqlErr = parseSqlError(err)
      if (sqlErr === SqlError.DUPLICATE_ENTRY)
        responseError(ErrorCode.DESKTOP_ID_EXISTS)
      responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
    }
  }

  @ApiOperation({ summary: '停用一个云桌面' })
  @HasPermission(PermissionType.DESKTOP_DISABLE)
  @Delete(':desktopId')
  public async deleteDesktop(@Param() param: DesktopIdDto) {
    const desktop = await this._desktopSrv.repo().findOne({ where: { id: param.desktopId } })
    if (desktop.disabled)
      return true
    if (desktop.userId) {
      // 将用户的状态更新
      const queue = await this._desktopReqSrv.repo().findOne({ where: { userId: desktop.userId } })
      if (!queue)
        return
      await this._desktopHisSrv.mv2history(
        queue,
        DesktopQueueHistoryStatus.Expired,
        {},
      )
    }

    const updateRes = await this._desktopSrv.repo().update(
      { id: param.desktopId },
      { disabled: true, userId: null, lastUserId: desktop.userId, expiredAt: new Date() },
    )
    return updateRes.affected > 0
  }

  @ApiOperation({ summary: '更新一个云桌面（无法更新一个已禁用的）' })
  @HasPermission(PermissionType.DESKTOP_UPDATE)
  @Patch(':desktopId')
  public async updateDesktop(
    @Param() param: DesktopIdDto,
    @Body() body: UpdateDesktopBodyDto,
  ) {
    const oldDesktop = await this._desktopSrv.repo().findOne({ where: { id: param.desktopId } })
    const updateRes = await this._desktopSrv.repo().update(
      { id: param.desktopId, disabled: false },
      { ...body },
    )
    setTimeout(async () => {
      if (!body.accessUrl && !body.password && !body.account)
        return
      const desktop = await this._desktopSrv.repo().findOne({
        where: { id: param.desktopId },
        relations: { user: { verification: true } },
      })
      let accessUrlUpdated, passwordUpdated, accountUpdated
      if (body.accessUrl && oldDesktop.accessUrl !== body.accessUrl)
        accessUrlUpdated = true
      if (body.password && oldDesktop.password !== body.password)
        passwordUpdated = true
      if (body.account && oldDesktop.account !== body.account)
        accountUpdated = true
      if (!accessUrlUpdated && !passwordUpdated && !accountUpdated)
        return
      this._notifySrv.notifyUserDesktopInfoChanged(desktop)
    })
    return updateRes.affected > 0
  }

  @ApiOperation({ summary: '批量删除云桌面（无法删除未禁用的）' })
  @HasPermission(PermissionType.DESKTOP_DELETE)
  @Delete('delete/batch')
  public async batchDeleteDesktop(@Body() body: DesktopIdDto[]) {
    const deleteRes = await this._desktopSrv.repo()
      .createQueryBuilder()
      .delete()
      .where({ disabled: true })
      .andWhere({ id: In(body) })
      .execute()

    return deleteRes.affected > 0
  }

  @ApiOperation({ summary: '分配云桌面给指定的用户' })
  @HasPermission(PermissionType.DESKTOP_ASSIGN)
  @Patch(':desktopId/assign/:userId')
  public async assignDesktop(
    @Param() param: AssignDesktopParamDto,
  ) {
    const request = await this._desktopReqSrv.repo().findOne({ where: { userId: param.userId } })
    // 确认是否已是排队状态
    if (request.status !== DesktopQueueStatus.Queueing)
      responseError(ErrorCode.DESKTOP_REQUEST_QUEUE_ONLY)
    // 将云桌面分配，并更新用户的状态
    await this._desktopSrv.allocationDesktop(param.desktopId, param.userId, request.duration)
    return true
  }

  @ApiOperation({ summary: '查询云桌面列表' })
  @HasPermission(PermissionType.DESKTOP_QUERY)
  @ApiSuccessResponse(QueryResDto<Desktop>)
  @Post('query')
  public async queryDesktop(@Body() body: QueryDto<Desktop>) {
    return await getQuery(this._desktopSrv.repo(), body || {})
  }

  @ApiOperation({ summary: '手动检查云桌面的过期' })
  @HasPermission(PermissionType.DESKTOP_EXPIRE_CHECK)
  @ApiQuery({ name: 'accessKey', description: '操作认证' })
  @Post('check-expire-manually')
  public async checkDesktopExpireManually(@Query('accessKey') accessKey: string) {
    if (accessKey !== 'ZJF-DESKTOP-EXPIRE-CHECK_manually')
      responseError(ErrorCode.PERMISSION_DENIED)
    this._desktopSrv.checkExpiredDesktop()
    return true
  }

  @ApiOperation({ summary: '查询当前用户分配的云桌面的信息' })
  @IsLogin()
  @ApiSuccessResponse(DesktopResDto)
  @Get('own')
  public async getOwnDesktop(@Req() req: FastifyRequest) {
    const user = req.raw.user
    return await this._desktopSrv.repo().findOne({ where: { userId: user.id } })
  }

  @VerifiedRequiredToken()
  @ApiOperation({ summary: '获取云桌面虚拟机列表', description: '返回所有云桌面虚拟机的 id、name、ip' })
  @Get('vm-list')
  public async getVMList() {
    return await this._zstackSrv.vmList()
  }
}
