import { Mixin } from 'ts-mixer'
import type { IUpdatePasswordByCodeBodyDto } from 'zjf-types'

import { EmailDto } from 'src/dto/email.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class UpdatePasswordByCodeBodyDto
  extends Mixin(PasswordDto, EmailDto, CodeVerifyDto)
  implements IUpdatePasswordByCodeBodyDto {}
