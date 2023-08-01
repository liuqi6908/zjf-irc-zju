import { Throttle } from '@nestjs/throttler'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { EmailCodeVerify } from 'src/guards/email-code.guard'

import { EmailService } from './email.service'
import { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@ApiTags('Email | 邮件服务')
@Controller('email')
export class EmailController {
  constructor(
    private readonly _emailSrv: EmailService,
  ) {}

  @Throttle(1, 60)
  @ApiOperation({ summary: '发送验证码' })
  @EmailCodeVerify()
  @Post('code')
  public async sendCode(@Body() body: SendEmailCodeBodyDto) {
    return await this._emailSrv.sendCode(body)
  }
}
