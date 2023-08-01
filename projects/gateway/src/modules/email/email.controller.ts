import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { EmailService } from './email.service'
import { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@ApiTags('Email | 邮件服务')
@Controller('email')
export class EmailController {
  constructor(
    private readonly _emailSrv: EmailService,
  ) {}

  @ApiOperation({ summary: '发送验证码' })
  @Post('code')
  public async sendCode(@Body() body: SendEmailCodeBodyDto) {}
}
