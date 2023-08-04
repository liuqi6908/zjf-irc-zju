import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { AccountDto } from 'src/dto/account.dto'
import type { IRegisterBodyDto } from 'zjf-types'
import { PasswordDto } from 'src/dto/password.dto'
import { CodeVerifyDto } from 'src/dto/code-verify.dto'

export class RegisterBodyDto
  extends Mixin(AccountDto, EmailDto, PasswordDto, CodeVerifyDto)
  implements IRegisterBodyDto {}
