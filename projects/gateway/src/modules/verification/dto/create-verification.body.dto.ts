import { enumMarkdown } from 'zjf-utils'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsString } from 'class-validator'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { VerificationIdentify, verificationIdentifyDescriptions } from 'zjf-types'

export class CreateVerificationBodyDto implements ICreateVerificationBodyDto {
  @ApiProperty({ description: '真实姓名' })
  name: string

  @ApiProperty({
    description: `身份类型, 可用值：\n${
    enumMarkdown(verificationIdentifyDescriptions)}\n${
    sharedVariableMarkdown('VerificationIdentify', 'zjf-types', '身份类型枚举')}`,
    enum: VerificationIdentify,
  })
  @IsEnum(VerificationIdentify)
  identify: VerificationIdentify

  @ApiProperty({
    description: '附件列表',
    type: [String],
  })
  @IsString({ each: true })
  // @ArrayNotEmpty()
  attachments: string[]
}
