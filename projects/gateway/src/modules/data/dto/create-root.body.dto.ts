import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator'
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
    description: '英文名',
    maxLength: 40,
  })
  @IsString()
  @MaxLength(40, { message: '英文名最大长度为40个字符' })
  nameEN: string

  @ApiProperty({
    description: '资源ID（由用户提供，以便在对象存储中上传数据时对应起来）',
    maxLength: 40,
  })
  @IsString()
  @MaxLength(40, { message: '资源ID最大长度为40个字符' })
  id: string

  @ApiProperty({ required: false, description: '排序', example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number
}
