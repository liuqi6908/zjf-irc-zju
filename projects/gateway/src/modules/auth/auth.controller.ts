import { IsLogin } from 'src/guards/login.guard'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { Body, Controller, Post, Req } from '@nestjs/common'

import { JwtAuthService } from '../jwt-auth/jwt-auth.service'
import { emailAccountAtLeastOne } from '../../utils/validator/account-phone-at-least-one'
import { AuthService } from './auth.service'
import { RegisterBodyDto } from './dto/register.body.dto'
import { LoginSuccessResDto } from './dto/login-success.res.dto'
import { LoginByPasswordBodyDto } from './dto/login-by-password.body.dto'

@ApiTags('Auth | 身份验证')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly _authSrv: AuthService,
    private readonly _jwtAuthSrv: JwtAuthService,
  ) {}

  @ApiSuccessResponse(LoginSuccessResDto)
  @ApiOperation({ summary: '通过 账号/邮箱 + 密码 登录' })
  @Post('login/password')
  public async loginByPassword(@Body() body: LoginByPasswordBodyDto) {
    emailAccountAtLeastOne(body)
    return await this._authSrv.loginByPassword(body)
  }

  @ApiOperation({ summary: '注册' })
  public async register(
    @Body() body: RegisterBodyDto,
  ) {
    // return await this._authSrv.register()
  }

  @ApiOperation({ summary: '登出' })
  @IsLogin()
  @Post('logout')
  public async logout(@Req() req: FastifyRequest) {
    await this._jwtAuthSrv.destroyLoginAuthToken(req.raw.token)
    return true
  }
}
