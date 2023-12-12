import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { FilePathDto } from 'src/dto/file-path.dto'
import type { MinioConfig } from 'src/config/_minio.config'

export class FileIsExistParamDto extends FilePathDto {
  @ApiProperty({
    description: 'minio bucket',
    example: 'data',
  })
  @IsString()
  bucket: keyof MinioConfig['bucket']
}
