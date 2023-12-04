import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class VersionDto {
  @ApiProperty({ description: '配置版本', example: 'file' })
  @IsString()
  version: string
}
