import { Mixin } from 'ts-mixer'
import type { IUpdatePasswordByCodeBodyDto } from 'zjf-types'

import { EmailDto } from 'src/dto/email.dto'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'
import { RegisterPlatformDto } from 'src/dto/register-platform.dto'

export class UpdatePasswordByCodeBodyDto
  extends Mixin(PasswordDto, EmailDto, CodeVerifyDto, RegisterPlatformDto)
  implements IUpdatePasswordByCodeBodyDto {}
