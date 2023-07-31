import { Mixin } from 'ts-mixer'
import { PasswordDto } from 'src/dto/password.dto'
import { NicknameDto } from 'src/dto/nickname.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import type { ICreateUserBodyDto } from 'zjf-types'
import { AccountOptionalDto } from 'src/dto/account.dto'

export class CreateUserBodyDto extends Mixin(
  AccountOptionalDto,
  EmailOptionalDto,
  PasswordDto,
  NicknameDto,
) implements ICreateUserBodyDto {}
