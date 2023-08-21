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
  @MaxLength(20)
  nameZH: string
}
