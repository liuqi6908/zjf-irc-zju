import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsOptional, MaxLength, MinLength } from 'class-validator'
import { IsValidPhone } from 'src/decorators/validators/is-valid-phone'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

import {
  PHONE_NUMBER_MAX_LENGTH,
  PHONE_NUMBER_MIN_LENGTH,
  PHONE_NUMBER_REQUIREMENTS_DESC,
} from 'zjf-utils'

export class PhoneDto {
  @decorate(ApiProperty({
    description: `手机号码, ${PHONE_NUMBER_REQUIREMENTS_DESC}` + `\n${sharedVariableMarkdown('PHONE_NUMBER_REQUIREMENTS_DESC')}`,
    maxLength: PHONE_NUMBER_MAX_LENGTH,
    minLength: PHONE_NUMBER_MIN_LENGTH,
    type: () => String,
    example: '18888888888',
  }))
  @decorate(IsValidPhone())
  @decorate(MinLength(PHONE_NUMBER_MIN_LENGTH, { message: `手机号码长度不能小于${PHONE_NUMBER_MIN_LENGTH}` }))
  @decorate(MaxLength(PHONE_NUMBER_MAX_LENGTH, { message: `手机号码长度不能大于${PHONE_NUMBER_MAX_LENGTH}` }))
  @decorate(IsValidPhone())
  @decorate(Transform(({ value }) => value.toString()))
  phone?: string
}

export class PhoneOptionalDto extends PhoneDto {
  @decorate(ApiProperty({ required: false }))
  @decorate(IsOptional())
  declare phone?: string
}
