import { Resend } from 'resend'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { OnModuleInit } from '@nestjs/common'

@Injectable()
export class EmailService implements OnModuleInit {
  readonly resend: Resend

  constructor(private readonly _cfgSrv: ConfigService) {
    this.resend = new Resend(_cfgSrv.get<string>('email.resendApiKey'))
  }

  onModuleInit() {}

  getClient() {
    return this.resend
  }
}
