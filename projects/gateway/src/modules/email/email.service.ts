import * as nodemailer from 'nodemailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { OnModuleInit } from '@nestjs/common'

import { CodeService } from '../code/code.service'

import type { LoginByEmailLinkDto } from '../auth/dto/login-by-email-link.body.dto'
import type { SendEmailCodeBodyDto } from './dto/send-email-code.body.dto'

@Injectable()
export class EmailService implements OnModuleInit {
  // readonly resend: Resend
  readonly transporter: nodemailer.Transporter

  constructor(
    private readonly _cfgSrv: ConfigService,
    private readonly _codeSrv: CodeService,
  ) {
    // this.resend = new Resend(_cfgSrv.get<string>('email.resendApiKey'))
    this.transporter = nodemailer.createTransport(_cfgSrv.get('email.smtp'))
  }

  onModuleInit() {}

  getClient() {
    return this.transporter
  }

  send(mailOptions: nodemailer.SendMailOptions) {
    return this.transporter.sendMail({
      ...mailOptions,
      from: 'NoReplay <noreplay@qiyandata.com>',
    })
  }

  public async sendCode(body: SendEmailCodeBodyDto) {
    const expInMin = 5
    const { email, action } = body
    const { code, bizId } = await this._codeSrv.createCode(email, action, expInMin)
    const subject = `ZJF ${action}`
    const html = `<p>Your code for ${action} is: <strong>${code}</strong>, expire in ${expInMin} minutes</p>`
    this.send({
      to: email,
      subject,
      html,
    }).catch(console.error)
    return { bizId }
  }

  public async sendMagicLink(body: LoginByEmailLinkDto, token: string) {
    const href = `${body.redirect}${body.redirect.includes('?') ? '&' : '?'}${body.queryName || 'token'}=${token}`
    this.send({
      to: body.email,
      subject: 'ZJF Login',
      html: `<a href="${href}">Click here to Login</a>, or copy this link to your browser: ${href}`,
    })
  }
}
