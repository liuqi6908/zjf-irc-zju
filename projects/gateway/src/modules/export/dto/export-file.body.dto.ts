import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, MaxLength } from 'class-validator'

export class ExportFileBodyDto {
  @ApiPropertyOptional({ description: '备注信息', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  note?: string
}
