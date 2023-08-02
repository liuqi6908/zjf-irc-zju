import { Throttle } from '@nestjs/throttler'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiSuccessResponse } from 'src/utils/response'
import { EmailCodeVerify } from 'src/guards/email-code.guard'

import { EmailService } from './email.service'
import { SendEmailCodeResDto } from './dto/send-email-code.res.dto'
import { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@ApiTags('Email | 邮件服务')
@Controller('email')
export class EmailController {
  constructor(
    private readonly _emailSrv: EmailService,
  ) {}

  @Throttle(1, 60)
  @ApiOperation({ summary: '发送验证码' })
  @ApiSuccessResponse(SendEmailCodeResDto)
  @EmailCodeVerify()
  @Post('code')
  public async sendCode(@Body() body: SendEmailCodeBodyDto) {
    return await this._emailSrv.sendCode(body)
  }
}
