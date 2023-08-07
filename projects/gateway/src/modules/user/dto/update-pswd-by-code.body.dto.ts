import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import type { IUpdatePasswordByCodeBodyDto } from 'zjf-types'

export class UpdatePasswordByCodeBodyDto
  extends Mixin(PasswordDto, EmailDto, CodeVerifyDto)
  implements IUpdatePasswordByCodeBodyDto {}
