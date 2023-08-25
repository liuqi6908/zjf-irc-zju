import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class DataDirectoryIdDto {
  @ApiProperty({
    description: '数据目录的唯一标识',
    example: 'd0b0d0b0-d0b0-d0b0-d0b0-d0b0d0b0d0b0',
  })
  @IsString()
  dataDirectoryId: string
}
