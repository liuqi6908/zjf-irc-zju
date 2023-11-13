import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import type { ISendEmailCodeBodyDto } from 'zjf-types'
import { CodeActionDto } from 'src/dto/code-action.dto'
import { RegisterPlatformOptionalDto } from 'src/dto/register-platform.dto'

export class SendEmailCodeBodyDto
  extends Mixin(EmailDto, CodeActionDto, RegisterPlatformOptionalDto)
  implements ISendEmailCodeBodyDto {}
