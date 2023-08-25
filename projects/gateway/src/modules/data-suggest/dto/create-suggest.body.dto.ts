import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength } from 'class-validator'

export class CreateSuggestBodyDto {
  @ApiProperty({ description: '建议采购的理由', maxLength: 200 })
  @IsString()
  @MaxLength(200)
  reason: string
}
