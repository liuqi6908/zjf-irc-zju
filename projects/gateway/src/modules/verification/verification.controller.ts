import { getQuery } from 'src/utils/query'
import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HasPermission } from 'src/guards/permission.guard'
import { VerificationIdDto } from 'src/dto/id/verification.dto'
import type { VerificationHistory } from 'src/entities/verification'
import { ErrorCode, PermissionType, VerificationStatus } from 'zjf-types'
import { VerificationExists } from 'src/guards/verification-exists.guard'
import { ApiErrorResponse, ApiSuccessResponse, responseError } from 'src/utils/response'
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common'

import { QueryDto, QueryResDto } from '../../dto/query.dto'
import { NotifyService } from '../notify/notify.service'
import { VerificationService } from './verification.service'
import { VerificationResDto } from './dto/verification.res.dto'
import { CreateVerificationBodyDto } from './dto/create-verification.body.dto'
import { RejectVerificationBodyDto } from './dto/reject-verification.body.dto'

@ApiTags('Verification | 身份审核')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly _verificationSrv: VerificationService,
    private readonly _notifySrv: NotifyService,
  ) {}

  @ApiOperation({ summary: '发起一个认证申请' })
  @ApiSuccessResponse(VerificationResDto)
  @ApiErrorResponse(ErrorCode.VERIFICATION_PENDING_EXISTS, ErrorCode.VERIFICATION_NOT_PENDING)
  @IsLogin()
  @Put()
  public async createVerification(
    @Body() body: CreateVerificationBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user
    if (user.verificationId)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)
    const res = await this._verificationSrv.createVerification(user, body)
    this._notifySrv.notifyNewVerification(res)
    return res
  }

  @ApiOperation({ summary: '获取最近一次的申请认证记录' })
  @ApiSuccessResponse(VerificationResDto)
  @IsLogin()
  @Get('latest')
  public async getLatestVerification(@Req() req: FastifyRequest) {
    const user = req.raw.user
    return this._verificationSrv.getLatestVerificationByFounderId(user.id)
  }

  @ApiOperation({ summary: '查询所有用户的认证申请' })
  @ApiSuccessResponse(QueryResDto)
  @HasPermission([PermissionType.VERIFICATION_LIST_ALL])
  @Post('query')
  public async queryAllVerifications(
    @Body() body: QueryDto<VerificationHistory>,
  ) {
    return await getQuery(this._verificationSrv.repo(), body)
  }

  @ApiOperation({ summary: '取消一个认证申请（仅当该申请待处理时有效）' })
  @ApiSuccessResponse(VerificationResDto)
  @HasPermission()
  @ApiErrorResponse(ErrorCode.PERMISSION_DENIED)
  @VerificationExists()
  @IsLogin()
  @Delete('cancel/:verificationId')
  public async cancelVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
  ) {
    const verification = req.verificationExistsGuardVerification!
    const user = req.raw.user
    const permissions = user?.role?.permissions || []

    // 取消自己的申请，或者是管理员取消
    if (
      verification.founderId !== req.raw.user!.id
      || !permissions.some(p => p.name === PermissionType.VERIFICATION_CANCEL)
    )
      responseError(ErrorCode.PERMISSION_DENIED)

    return this._verificationSrv.updateVerificationStatus(
      req.verificationExistsGuardVerification!,
      user,
      VerificationStatus.CANCELLED,
    )
  }

  @ApiOperation({
    summary: '重置一个认证申请（仅当该申请已通过时有效），统一使用 cancel 接口',
    deprecated: true,
  })
  @ApiSuccessResponse(VerificationResDto)
  @ApiErrorResponse(ErrorCode.PERMISSION_DENIED)
  @VerificationExists()
  @IsLogin()
  @Delete('reset/:verificationId')
  public async resetVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
  ) {
    responseError(ErrorCode.COMMON_DEPRECATED)
    const verification = req.verificationExistsGuardVerification!
    if (verification.status !== VerificationStatus.APPROVED)
      responseError(ErrorCode.VERIFICATION_NOT_APPROVED)

    const user = req.raw.user
    return this._verificationSrv.updateVerificationStatus(
      verification, user, VerificationStatus.CANCELLED,
    )
  }

  @ApiOperation({ summary: '通过一个认证申请' })
  @ApiErrorResponse(ErrorCode.VERIFICATION_NOT_PENDING)
  @VerificationExists()
  @HasPermission([PermissionType.VERIFICATION_APPROVE])
  @Patch('approve/:verificationId')
  public async approveVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
  ) {
    const verification = req.verificationExistsGuardVerification!
    const user = req.raw.user!
    if (verification.status !== VerificationStatus.PENDING)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)
    return await this._verificationSrv.updateVerificationStatus(
      verification,
      user,
      VerificationStatus.APPROVED,
    )
  }

  @ApiOperation({ summary: '驳回一个认证申请' })
  @ApiErrorResponse(ErrorCode.VERIFICATION_NOT_PENDING, ErrorCode.VERIFICATION_REJECT_REASON_REQUIRED)
  @VerificationExists()
  @HasPermission([PermissionType.VERIFICATION_REJECT])
  @Patch('reject/:verificationId')
  public async rejectVerification(
    @Param() _: VerificationIdDto,
    @Req() req: FastifyRequest,
    @Body() body: RejectVerificationBodyDto,
  ) {
    const verification = req.verificationExistsGuardVerification!
    const user = req.raw.user!
    if (verification.status !== VerificationStatus.PENDING)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)
    return await this._verificationSrv.updateVerificationStatus(
      verification,
      user,
      VerificationStatus.REJECTED,
      body.reason,
    )
  }
}
