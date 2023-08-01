import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import { ApiProperty } from '@nestjs/swagger'
import { AccountDto } from 'src/dto/account.dto'
import type { IRegisterBodyDto } from 'zjf-types'
import { PasswordDto } from 'src/dto/password.dto'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterBodyDto
  extends Mixin(AccountDto, EmailDto, PasswordDto)
  implements IRegisterBodyDto {
  @ApiProperty({ description: '获取验证码时获取到的唯一标识' })
  @IsString()
  bizId: string

  @ApiProperty({ description: '发送到邮箱的验证码', maxLength: 6, minLength: 6 })
  @MaxLength(6)
  @MinLength(6)
  @IsString()
  code: string
}
