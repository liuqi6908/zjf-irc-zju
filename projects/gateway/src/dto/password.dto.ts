import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { IsValidPassword } from 'src/decorators/validators/is-valid-password'

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_DESC,
  decryptPasswordInHttp,
} from 'zjf-utils'

export class PasswordDto {
  @decorate(ApiProperty({
    description: `密码，需要加密，${PASSWORD_REQUIREMENTS_DESC}
      ${sharedVariableMarkdown('PASSWORD_REQUIREMENTS_DESC')}
      ${sharedVariableMarkdown('encryptPasswordInHttp', undefined, '加密函数')}`,
    maxLength: PASSWORD_MAX_LENGTH,
    minLength: PASSWORD_MIN_LENGTH,
    type: () => String,
    example: 'empmVXNPMTExMTExMTE=',
  }))
  @decorate(IsValidPassword())
  @decorate(MinLength(PASSWORD_MIN_LENGTH, { message: `密码长度不能小于${PASSWORD_MIN_LENGTH}` }))
  @decorate(MaxLength(PASSWORD_MAX_LENGTH, { message: `密码长度不能大于${PASSWORD_MAX_LENGTH}` }))
  @decorate(IsString({ message: '密码必须是字符串' }))
  @decorate(Transform(({ value }) => decryptPasswordInHttp(value)))
  password?: string
}

export class PasswordOptionalDto extends PasswordDto {
  @decorate(ApiProperty({ required: false }))
  @decorate(IsOptional())
  declare password?: string
}
