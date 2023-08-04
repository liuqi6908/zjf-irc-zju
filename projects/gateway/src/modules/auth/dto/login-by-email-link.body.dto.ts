import { Mixin } from 'ts-mixer'
import { EmailDto } from 'src/dto/email.dto'
import type { ILoginByEmailLinkDto } from 'zjf-types'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class LoginByEmailLinkDto
  extends Mixin(EmailDto)
  implements ILoginByEmailLinkDto {
  @ApiProperty({ description: '重定向的地址' })
  @IsString()
  public redirect: string

  @ApiPropertyOptional({
    description: 'token 存储的参数名称',
    default: 'token',
    maxLength: 32,
    minLength: 1,
  })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  @MinLength(1)
  public queryName?: string
}
