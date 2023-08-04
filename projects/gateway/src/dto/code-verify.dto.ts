import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class CodeVerifyDto {
  @decorate(ApiProperty({ description: '获取验证码时获取到的唯一标识', type: () => String }))
  @decorate(IsString())
  bizId: string

  @decorate(ApiProperty({
    description: '发送到邮箱的验证码',
    maxLength: 6,
    minLength: 6,
    type: () => String,
  }))
  @decorate(MaxLength(6))
  @decorate(MinLength(6))
  @decorate(IsString())
  code: string
}
