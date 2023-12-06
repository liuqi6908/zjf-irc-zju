import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IUploadTypeDto } from 'zjf-types'
import { objectEntries } from '@catsjuice/utils'
import { UploadType, uploadTypeDescriptions } from 'zjf-types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class UploadTypeDto implements IUploadTypeDto {
  @decorate(ApiProperty({
    description: `上传表格数据类型
    \n${objectEntries(uploadTypeDescriptions).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
    ${sharedVariableMarkdown('UploadType', 'zjf-types', 'uploadType枚举值')}`,
    enum: UploadType,
    example: UploadType.PREVIEW,
  }))
  @decorate(IsEnum(UploadType, { message: 'uploadType必须是 UploadType 枚举值' }))
  uploadType: UploadType
}
