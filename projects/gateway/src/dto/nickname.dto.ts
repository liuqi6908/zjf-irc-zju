import { decorate } from 'ts-mixer'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class NicknameDto {
  @decorate(ApiProperty({
    description: '用户昵称',
    example: '法外狂徒张三',
    type: () => String,
  }))
  @decorate(IsString())
  nickname?: string
}

export class NicknameOptionalDto extends NicknameDto {
  @decorate(ApiProperty({ required: false }))
  @decorate(IsOptional())
  nickname?: string
}
