import { ApiProperty } from '@nestjs/swagger'
import type { IFilePathDto } from 'zjf-types'
import { IsString, MinLength } from 'class-validator'

export class FilePathDto implements IFilePathDto {
  @ApiProperty({
    description: '上传的文件完整路径（需要带上文件名、后缀）',
  })
  @IsString()
  @MinLength(1)
  path: string
}
