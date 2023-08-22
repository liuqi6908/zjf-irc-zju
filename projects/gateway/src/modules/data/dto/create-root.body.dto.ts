import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'
import type { ICreateRootBodyDto } from 'zjf-types'

export class CreateRootBodyDto implements ICreateRootBodyDto {
  @ApiProperty({
    description: '中文名',
    example: '自建数据库',
    maxLength: 20,
  })
  @IsString()
  @MaxLength(20, { message: '中文名最大长度为20个字符' })
  nameZH: string

  @ApiProperty({
    description: '英文名（由用户提供，以便在对象存储中上传数据时对应起来）',
    maxLength: 40,
  })
  @IsString()
  @MaxLength(40, { message: '英文名最大长度为40个字符' })
  nameEN: string
}
