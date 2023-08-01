import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH } from 'zjf-utils'
import { MaxLength, MinLength } from 'class-validator'

import { GenerateParamsDecorator } from 'src/utils/params-decorator-gen'
import { IsValidEmail } from '../decorators/validators/is-valid-email'

function EmailDecorator(isOptional = false) {
  return GenerateParamsDecorator(
    [
      ApiProperty({
        description: '邮箱',
        maxLength: EMAIL_MAX_LENGTH,
        minLength: EMAIL_MIN_LENGTH,
        type: () => String,
        example: '10086had@gmail.com',
      }),
      MinLength(EMAIL_MIN_LENGTH, { message: `邮箱长度不能小于${EMAIL_MIN_LENGTH}` }),
      MaxLength(EMAIL_MAX_LENGTH, { message: `邮箱长度不能大于${EMAIL_MAX_LENGTH}` }),
      IsValidEmail(),
    ],
    isOptional,
  )
}

export class EmailDto {
  @decorate(EmailDecorator())
  email: string
}

export class EmailOptionalDto {
  @decorate(EmailDecorator(true))
  declare email?: string
}
