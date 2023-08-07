import { objectOmit } from '@catsjuice/utils'
import type { User } from 'src/entities/user'
import { IsLogin } from 'src/guards/login.guard'
import { CodeAction, ErrorCode } from 'zjf-types'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { EmailCodeVerify } from 'src/guards/email-code-verify.guard'
import { ApiSuccessResponse, responseError } from 'src/utils/response'
import { UniversalOperationResDto } from 'src/dto/universal-operation.dto'
import { responseParamsError } from 'src/utils/response/validate-exception-factory'
import { Body, Controller, Delete, Get, Inject, Patch, Put, Query, Req, forwardRef } from '@nestjs/common'
import { emailAccountAtLeastOne } from 'src/utils/validator/account-phone-at-least-one'

import { Throttle } from '@nestjs/throttler'
import { comparePassword } from 'src/utils/encrypt/encrypt-password'
import { AuthService } from '../auth/auth.service'
import { UserService } from './user.service'
import { UserProfileResponseDto } from './dto/user.res.dto'
import { CreateUserResDto } from './dto/create-user.res.dto'
import { CreateUserBodyDto } from './dto/create-user.body.dto'
import { GetProfileOwnQueryDto } from './dto/get-profile-own.query.dto'
import { UpdateEmailOwnBodyDto } from './dto/update-email-own.body.dto'
import { UnbindEmailOwnBodyDto } from './dto/unbind-email-own.body.dto'
import { UpdateProfileOwnBodyDto } from './dto/update-profile-own.body.dto'
import { UpdatePasswordByOldBodyDto } from './dto/update-pswd-by-old.body.dto'
import { UpdatePasswordByCodeBodyDto } from './dto/update-pswd-by-code.body.dto'

@ApiTags('User | 用户')
@Controller('user')
export class UserController {
  constructor(
    private readonly _userSrv: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly _authSrv: AuthService,
  ) {}

  @ApiOperation({ summary: '创建一个新用户' })
  @ApiSuccessResponse(CreateUserResDto)
  @Put('create')
  public async createUser(@Body() body: CreateUserBodyDto) {
    emailAccountAtLeastOne(body)
    return await this._userSrv.insertUser(body)
  }

  @ApiOperation({ summary: '获取当前登录用户的信息' })
  @ApiSuccessResponse(UserProfileResponseDto)
  @IsLogin()
  @Get('profile/own')
  public async getOwnProfile(
    @Query() query: GetProfileOwnQueryDto,
    @Req() req: FastifyRequest,
  ) {
    const omitFields: Array<keyof User> = ['password', 'isDeleted', 'isSysAdmin']
    if (!query.relation) {
      return objectOmit(
        (req.raw?.user || {}) as User, omitFields,
      )
    }
    try {
      const user = await this._userSrv.findById(req.raw?.user?.id, {
        relations: query.relation as any,
      })
      return objectOmit(user, omitFields)
    }
    catch (err) {
      const sqlError = parseSqlError(err)
      if (sqlError === SqlError.ENTITY_PROPERTY_NOT_FOUND) {
        responseParamsError([{
          property: 'relation',
          constraints: { relation: '关联信息有误' },
        }])
      }

      throw err
    }
  }

  @ApiOperation({ summary: '修改基本信息' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @Patch('own/profile')
  public async updateOwnProfile(
    @Body() body: UpdateProfileOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    return await this._userSrv.updateUserBasicInfo(
      { id: req.raw?.user?.id },
      body,
    )
  }

  @ApiOperation({ summary: '解绑邮箱' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @EmailCodeVerify(CodeAction.UNBIND_EMAIL)
  @Delete('own/email')
  public async unbindOwnEmail(
    @Body() body: UnbindEmailOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    const userEmail = user.email
    if (userEmail !== body.email)
      responseError(ErrorCode.USER_EMAIL_NOT_MATCHED)
    await this._userSrv.repo().update({ id: user.id }, { email: null })
    return true
  }

  @ApiOperation({ summary: '修改邮箱，简单处理，只要用户处于登录状态就可以修改邮箱，不需要校验原邮箱的权限，发送验证码到新的邮箱地址之后即可' })
  @EmailCodeVerify(CodeAction.BIND_EMAIL)
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @Patch('own/email')
  public async updateOwnEmail(
    @Body() body: UpdateEmailOwnBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    return await this._userSrv.updateUserEmail(user.id, body.email)
  }

  @Throttle(1, 10)
  @ApiOperation({ summary: '通过原密码修改密码（需要登录）' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @IsLogin()
  @Patch('own/password/old')
  public async updateOwnPasswordByOldPassword(
    @Body() body: UpdatePasswordByOldBodyDto,
    @Req() req: FastifyRequest,
  ) {
    const user = req.raw.user!
    const correct = await comparePassword(body.oldPassword, user.password)
    if (!correct)
      responseError(ErrorCode.AUTH_PASSWORD_NOT_MATCHED)
    await this._userSrv.updateUserPassword({ id: user.id }, body.newPassword)
    // 登出当前用户的所有登录会话
    this._authSrv.logoutUser(user.id)
    return true
  }

  @ApiOperation({ summary: '通过邮箱验证码修改密码（不需要登录）' })
  @ApiSuccessResponse(UniversalOperationResDto)
  @EmailCodeVerify(CodeAction.CHANGE_PASSWORD)
  @Patch('own/password/code')
  public async updateOwnPasswordByCode(@Body() body: UpdatePasswordByCodeBodyDto) {
    const { email, password } = body
    const user = await this._userSrv.repo().findOne({ where: { email } })
    if (!user)
      responseError(ErrorCode.AUTH_EMAIL_NOT_REGISTERED)
    await this._userSrv.updateUserPassword({ id: user.id }, password)
    // 登出当前用户的所有登录会话
    this._authSrv.logoutUser(user.id)
    return true
  }
}
