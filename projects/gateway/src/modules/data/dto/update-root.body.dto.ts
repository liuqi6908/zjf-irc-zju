import { ApiProperty } from '@nestjs/swagger'
import { IsOptional } from 'class-validator'
import { CreateRootBodyDto } from './create-root.body.dto'

export class UpdateRootBodyDto extends CreateRootBodyDto {
  @ApiProperty({ required: false })
  @IsOptional()
  nameZH: string

  @ApiProperty({ required: false })
  @IsOptional()
  nameEN: string

  @ApiProperty({ required: false })
  @IsOptional()
  order?: number
}
