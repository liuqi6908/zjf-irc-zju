import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import type { IUpdateEmailOwnBodyDto } from 'zjf-types'

export class UpdateEmailOwnBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements IUpdateEmailOwnBodyDto {}
