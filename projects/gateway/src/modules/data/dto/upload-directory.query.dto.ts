import { parseBoolRaw } from 'zjf-utils'
import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import type { IUploadDirectoryQueryDto } from 'zjf-types'

export class UploadDirectoryQueryDto implements IUploadDirectoryQueryDto {
  @ApiProperty({
    description: '是否清空原有数据',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseBoolRaw(value))
  @IsBoolean()
  clear?: boolean
}
