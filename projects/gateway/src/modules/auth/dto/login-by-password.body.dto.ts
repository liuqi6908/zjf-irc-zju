import { Mixin } from 'ts-mixer'
import { EmailOptionalDto } from 'src/dto/email.dto'
import type { ILoginByPasswordBodyDto } from 'zjf-types'

import { AccountOptionalDto } from 'src/dto/account.dto'
import { PasswordDto } from '../../../dto/password.dto'

export class LoginByPasswordBodyDto extends Mixin(
  PasswordDto,
  AccountOptionalDto,
  EmailOptionalDto,
) implements ILoginByPasswordBodyDto {}
