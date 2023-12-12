import { getQuery } from 'src/utils/query'
import { UserIdDto } from 'src/dto/user-id.dto'
import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { QueryDto, QueryResDto } from 'src/dto/query.dto'
import { HasPermission } from 'src/guards/permission.guard'
import type { DesktopQueue } from 'src/entities/desktop-queue'
import { VerifiedRequired } from 'src/guards/verify-required.guard'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common'
import { DesktopQueueHistoryStatus, DesktopQueueStatus, ErrorCode, PermissionType } from 'zjf-types'

import { DesktopService } from '../desktop.service'
import { DesktopQueueHistoryService } from '../desktop-queue-history/desktop-queue-history.service'
import { DesktopRequestService } from './desktop-request.service'
import { GetOwnDesktopReqResDto } from './dto/get-own-desktop-req.res.dto'
import { RejectDesktopReqBodyDto } from './dto/reject-desktop-req.body.dto'
import { CreateDesktopRequestBodyDto } from './dto/create-desktop-req.body.dto'

@ApiTags('DesktopRequest | 云桌面申请')
@Controller('desktop-request')
export class DesktopRequestController {
  constructor(
    private readonly _desktopSrv: DesktopService,
    private readonly _desktopReqSrv: DesktopRequestService,
    private readonly _desktopReqHistorySrv: DesktopQueueHistoryService,
  ) {}

  @ApiOperation({ summary: '发起一个云桌面使用申请' })
  @IsLogin()
  @VerifiedRequired()
  @Put()
  async requestDesktop(
    @Body() body: CreateDesktopRequestBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    return await this._desktopReqSrv.createRequest(user.id, body)
  }

  @ApiOperation({ summary: '通过一个云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_APPROVE)
  @Post('approve/:userId')
  async approveRequest(@Param() param: UserIdDto) {
    return await this._desktopReqSrv.approveRequest(param)
  }

  @ApiOperation({ summary: '驳回一个云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_REJECT)
  @Post('reject/:userId')
  async rejectRequest(@Param() param: UserIdDto, @Body() body: RejectDesktopReqBodyDto) {
    const queue = await this._desktopReqSrv.repo().findOne({
      where: { userId: param.userId },
    })
    if (!queue)
      return false

    if (queue.status !== DesktopQueueStatus.Pending)
      responseError(ErrorCode.DESKTOP_REQUEST_PENDING_ONLY)

    return await this._desktopReqHistorySrv.mv2history(
      queue,
      DesktopQueueHistoryStatus.Rejected,
      { rejectReason: body.reason },
    )
  }

  @ApiOperation({ summary: '获取当前用户的云桌面使用申请情况' })
  @ApiSuccessResponse(GetOwnDesktopReqResDto)
  @IsLogin()
  @Get('own')
  async getOwnRequest(@Req() req: FastifyRequest) {
    const user = req.raw.user!
    const queue = await this._desktopReqSrv.repo().findOne({ where: { userId: user.id } })
    const queueLength = await this._desktopReqSrv.getLengthAheadOfQueue(queue)
    const lastRejected = queue
      ? null
      : await this._desktopReqHistorySrv.repo().findOne({
        where: { userId: user.id, status: DesktopQueueHistoryStatus.Rejected },
        order: { createdAt: 'DESC' },
      }) ?? null
    const lastExpired = queue
      ? null
      : await this._desktopSrv.repo().findOne({
        where: { lastUserId: user.id },
        order: { expiredAt: 'DESC' },
      }) ?? null

    const res: any = { queue, queueLength }
    if (lastRejected && lastExpired) {
      if (lastRejected.createdAt > lastExpired.expiredAt)
        res.lastRejected = lastRejected
      else
        res.lastExpired = lastExpired
    }
    else if (lastRejected) {
      res.lastRejected = lastRejected
    }
    else if (lastExpired) {
      res.lastExpired = lastExpired
    }
    return res
  }

  @ApiOperation({ summary: '查询云桌面申请' })
  @HasPermission(PermissionType.DESKTOP_REQUEST_QUERY)
  @ApiSuccessResponse(QueryResDto<DesktopQueue>)
  @Post('query')
  async queryRequests(@Body() body: QueryDto<DesktopQueue>) {
    return await getQuery(this._desktopReqSrv.repo(), body || {})
  }
}
