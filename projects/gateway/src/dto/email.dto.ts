import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { EMAIL_MAX_LENGTH, EMAIL_MIN_LENGTH } from 'zjf-utils'
import { IsOptional, MaxLength, MinLength } from 'class-validator'

import { IsValidEmail } from '../decorators/validators/is-valid-email'

export class EmailDto {
  @decorate(ApiProperty({
    description: '邮箱',
    maxLength: EMAIL_MAX_LENGTH,
    minLength: EMAIL_MIN_LENGTH,
    type: () => String,
    example: '10086had@gmail.com',
  }))
  @decorate(MinLength(EMAIL_MIN_LENGTH, { message: `邮箱长度不能小于${EMAIL_MIN_LENGTH}` }))
  @decorate(MaxLength(EMAIL_MAX_LENGTH, { message: `邮箱长度不能大于${EMAIL_MAX_LENGTH}` }))
  @decorate(IsValidEmail())
  email?: string
}

export class EmailOptionalDto extends EmailDto {
  @decorate(ApiProperty({ required: false }))
  @decorate(IsOptional())
  declare email?: string
}
