import { Mixin } from 'ts-mixer'
import { EmailOptionalDto } from 'src/dto/email.dto'
import { PasswordDto } from '../../../dto/password.dto'
import { PhoneOptionalDto } from '../../../dto/phone.dto'

export class LoginByPasswordBodyDto extends Mixin(
  PasswordDto,
  PhoneOptionalDto,
  EmailOptionalDto,
) {}
