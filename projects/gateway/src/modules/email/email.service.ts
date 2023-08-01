import { Resend } from 'resend'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { OnModuleInit } from '@nestjs/common'

import { CodeService } from '../code/code.service'
import type { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@Injectable()
export class EmailService implements OnModuleInit {
  readonly resend: Resend

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _codeSrv: CodeService,
  ) {
    this.resend = new Resend(_cfgSrv.get<string>('email.resendApiKey'))
  }

  onModuleInit() {}

  getClient() {
    return this.resend
  }

  public async sendCode(body: SendEmailCodeBodyDto) {
    const expInMin = 5
    const { email, action } = body
    const { code, bizId } = await this._codeSrv.createCode(email, action, expInMin)
    const subject = `ZJF ${action}`
    const html = `<p>Your code for ${action} is: <strong>${code}</strong>, expire in ${expInMin} minutes</p>`
    this.resend.emails.send({
      from: 'CatsJuice <catsjuice@oooo.so>',
      to: [email],
      subject,
      html,
    }).catch(console.error)
    return { bizId }
  }
}
