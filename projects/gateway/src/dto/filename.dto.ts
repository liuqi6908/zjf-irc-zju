import { decorate } from 'ts-mixer'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IFilenameDto } from 'zjf-types'
import { IsFilename } from 'src/decorators/validators/is-filename'

export class FilenameDto implements IFilenameDto {
  @decorate(ApiProperty({
    description: '文件名称（不能携带路径）',
    example: 'test.txt',
  }))
  @decorate(IsString())
  @decorate(IsFilename())
  filename: string
}
