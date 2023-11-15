import { Mixin } from 'ts-mixer'
import type { ILoginByPasswordBodyDto } from 'zjf-types'

import { EmailOptionalDto } from 'src/dto/email.dto'
import { AccountOptionalDto } from 'src/dto/account.dto'
import { PasswordDto } from 'src/dto/password.dto'

export class LoginByPasswordBodyDto extends Mixin(
  PasswordDto,
  AccountOptionalDto,
  EmailOptionalDto,
) implements ILoginByPasswordBodyDto {}
