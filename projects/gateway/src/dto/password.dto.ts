import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { IsValidPassword } from 'src/decorators/validators/is-valid-password'
import type { IPasswordDto, IPasswordOptionalDto } from 'zjf-types/types/dto/password.interface'

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REQUIREMENTS_DESC,
  decryptPasswordInHttp,
} from 'zjf-utils'

export function PasswordDecorator(isOptional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: `密码，需要加密，${PASSWORD_REQUIREMENTS_DESC}
        ${sharedVariableMarkdown('PASSWORD_REQUIREMENTS_DESC')}
        ${sharedVariableMarkdown('encryptPasswordInHttp', undefined, '加密函数')}`,
        maxLength: PASSWORD_MAX_LENGTH,
        minLength: PASSWORD_MIN_LENGTH,
        type: () => String,
        example: 'empmVXNPMTExMTExMTE=',
      }),
      IsValidPassword(),
      MinLength(PASSWORD_MIN_LENGTH, { message: `密码长度不能小于${PASSWORD_MIN_LENGTH}` }),
      MaxLength(PASSWORD_MAX_LENGTH, { message: `密码长度不能大于${PASSWORD_MAX_LENGTH}` }),
      IsString({ message: '密码必须是字符串' }),
      Transform(({ value }) => decryptPasswordInHttp(value)),
    ],
    isOptional,
  )
}

export class PasswordDto implements IPasswordDto {
  @decorate(PasswordDecorator())
  password: string
}

export class PasswordOptionalDto implements IPasswordOptionalDto {
  @decorate(PasswordDecorator(true))
  declare password?: string
}
