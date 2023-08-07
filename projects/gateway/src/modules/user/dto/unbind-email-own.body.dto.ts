import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import type { IUnbindEmailOwnBodyDto } from 'zjf-types'

export class UnbindEmailOwnBodyDto
  extends Mixin(EmailDto, CodeVerifyDto)
  implements IUnbindEmailOwnBodyDto {}
