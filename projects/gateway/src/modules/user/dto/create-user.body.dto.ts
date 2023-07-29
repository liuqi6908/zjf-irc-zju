import { Mixin } from 'ts-mixer'
import { PasswordDto } from 'src/dto/password.dto'
import { NicknameDto } from 'src/dto/nickname.dto'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { PhoneOptionalDto } from 'src/dto/phone.dto'
import type { ICreateUserBodyDto } from 'zjf-types'

export class CreateUserBodyDto extends Mixin(
  PhoneOptionalDto,
  EmailOptionalDto,
  PasswordDto,
  NicknameDto,
) implements ICreateUserBodyDto {}
