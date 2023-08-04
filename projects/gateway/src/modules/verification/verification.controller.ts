import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ErrorCode, PermissionType, VerificationStatus } from 'zjf-types'
import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common'
import { VerificationExists } from 'src/guards/verification-exists.guard'
import { ApiErrorResponse, ApiSuccessResponse, responseError } from 'src/utils/response'

import type { VerificationHistory } from 'src/entities/verification'
import { getQuery } from 'src/utils/query'
import { HasPermission } from 'src/guards/permission.guard'
import { QueryDto } from '../../dto/query.dto'
import { VerificationService } from './verification.service'
import { VerificationResDto } from './dto/verification.res.dto'
import { CreateVerificationBodyDto } from './dto/create-verification.body.dto'

@ApiTags('Verification | 身份审核')
@Controller('verification')
export class VerificationController {
  constructor(
    private readonly _verificationSrv: VerificationService,
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
    return await this._verificationSrv.createVerification(user, body)
  }

  @ApiOperation({ summary: '获取最近一次的申请认证记录' })
  @ApiSuccessResponse(VerificationResDto)
  @IsLogin()
  @Get('latest')
  public async getLatestVerification(@Req() req: FastifyRequest) {
    const user = req.raw.user
    return this._verificationSrv.getLatestVerificationByFounderId(user.id)
  }

  @ApiOperation({ summary: '取消一个认证申请（仅当该申请待处理时有效）' })
  @ApiSuccessResponse(VerificationResDto)
  @ApiErrorResponse(ErrorCode.PERMISSION_DENIED)
  @VerificationExists()
  @IsLogin()
  @Delete('cancel/:verificationId')
  public async cancelVerification(@Req() req: FastifyRequest) {
    const verification = req.verificationExistsGuardVerification!
    if (verification.status !== VerificationStatus.PENDING)
      responseError(ErrorCode.VERIFICATION_NOT_PENDING)

    const user = req.raw.user
    return this._verificationSrv.updateVerificationStatus(
      req.verificationExistsGuardVerification!,
      user,
      VerificationStatus.CANCELLED,
    )
  }

  @ApiOperation({ summary: '重置一个认证申请（仅当该申请已通过时有效）' })
  @ApiSuccessResponse(VerificationResDto)
  @ApiErrorResponse(ErrorCode.PERMISSION_DENIED)
  @VerificationExists()
  @IsLogin()
  @Delete('reset/:verificationId')
  public async resetVerification(@Req() req: FastifyRequest) {
    const verification = req.verificationExistsGuardVerification!
    if (verification.status !== VerificationStatus.APPROVED)
      responseError(ErrorCode.VERIFICATION_NOT_APPROVED)

    const user = req.raw.user
    return this._verificationSrv.updateVerificationStatus(
      verification, user, VerificationStatus.CANCELLED,
    )
  }

  @ApiOperation({ summary: '查询所有的认证申请' })
  @HasPermission([PermissionType.VERIFICATION_LIST_ALL])
  @Post('query')
  public async queryAllVerifications(
    @Body() body: QueryDto<VerificationHistory>,
  ) {
    return await getQuery(this._verificationSrv.repo(), body)
  }
}
