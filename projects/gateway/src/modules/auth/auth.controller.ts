import { ErrorCode } from 'zjf-types'
import { Throttle } from '@nestjs/throttler'
import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post, Put, Req } from '@nestjs/common'
import { ApiErrorResponse, ApiSuccessResponse } from 'src/utils/response'
import { emailAccountAtLeastOne } from 'src/utils/validator/account-phone-at-least-one'

import { JwtAuthService } from '../jwt-auth/jwt-auth.service'
import { AuthService } from './auth.service'
import { RegisterBodyDto } from './dto/register.body.dto'
import { LoginSuccessResDto } from './dto/login-success.res.dto'
import { LoginByEmailLinkDto } from './dto/login-by-email-link.body.dto'
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'
import { LoginByEmailCodeBodyDto } from './dto/login-by-email-code.body.dto'

@ApiTags('Auth | 身份验证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authSrv: AuthService,
    private readonly _jwtAuthSrv: JwtAuthService,
  ) {}

  @ApiOperation({ summary: '通过 账号/邮箱 + 密码 登录' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/password')
  public async loginByPassword(@Body() body: LoginByPasswordBodyDto) {
    emailAccountAtLeastOne(body)
    return await this._authSrv.loginByPassword(body)
  }

  @ApiOperation({
    summary: '通过邮箱 + 验证码 登录',
    deprecated: true,
  })
  @ApiSuccessResponse(LoginSuccessResDto)
  @Post('login/email/code')
  public async loginByEmailCode(@Body() body: LoginByEmailCodeBodyDto) {
    return await this._authSrv.loginByEmailCode(body)
  }

  @Throttle(1, 30)
  @ApiOperation({
    summary: '通过邮箱魔法链接登录（半分钟内只能发送一次）',
    deprecated: true,
  })
  @Post('login/email/link')
  public async loginByEmailLink(@Body() body: LoginByEmailLinkDto) {
    return await this._authSrv.loginByEmailLink(body)
  }

  @ApiOperation({ summary: '注册（邮箱+验证码）' })
  @ApiSuccessResponse(LoginSuccessResDto)
  @ApiErrorResponse(ErrorCode.AUTH_CODE_NOT_MATCHED)
  @Put('register')
  public async register(@Body() body: RegisterBodyDto) {
    return await this._authSrv.register(body)
  }

  @ApiOperation({ summary: '登出' })
  @IsLogin()
  @Post('logout')
  public async logout(@Req() req: FastifyRequest) {
    await this._jwtAuthSrv.destroyLoginAuthToken(req.raw.token)
    return true
  }
}
