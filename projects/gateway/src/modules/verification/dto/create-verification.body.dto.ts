import { ApiProperty } from '@nestjs/swagger'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'
import { ArrayNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

import {
  VERIFICATION_COLLEGE_MAX,
  VERIFICATION_ID_CARD_MAX,
  VERIFICATION_ID_CARD_MIN,
  VERIFICATION_NUMBER_MAX,
  VERIFICATION_SCHOOL_MAX,
} from 'zjf-types'

export class CreateVerificationBodyDto implements ICreateVerificationBodyDto {
  @ApiProperty({ description: '真实姓名' })
  name: string

  @ApiProperty({ description: '身份类型' })
  @IsString()
  identify: string

  @ApiProperty({
    description: `学校\n${sharedVariableMarkdown('VERIFICATION_SCHOOL_MAX', 'zjf-types', '最大长度')}`,
    maxLength: VERIFICATION_SCHOOL_MAX,
  })
  @IsString()
  @MaxLength(VERIFICATION_SCHOOL_MAX)
  school: string

  @ApiProperty({
    description: `学院\n${sharedVariableMarkdown('VERIFICATION_COLLEGE_MAX', 'zjf-types', '最大长度')}`,
    maxLength: VERIFICATION_COLLEGE_MAX,
  })
  @IsString()
  @MaxLength(VERIFICATION_COLLEGE_MAX)
  college: string

  @ApiProperty({
    description: `学号\n${sharedVariableMarkdown('VERIFICATION_NUMBER_MAX', 'zjf-types', '最大长度')}`,
    maxLength: VERIFICATION_NUMBER_MAX,
  })
  @IsString()
  @MaxLength(VERIFICATION_NUMBER_MAX)
  number: string

  @ApiProperty({
    description: `身份证号\n${sharedVariableMarkdown('VERIFICATION_ID_CARD_MAX', 'zjf-types', '最大长度')}\n${sharedVariableMarkdown('VERIFICATION_ID_CARD_MIN', 'zjf-types', '最小长度')}`,
    maxLength: VERIFICATION_ID_CARD_MAX,
    minLength: VERIFICATION_ID_CARD_MIN,
  })
  @IsString()
  @MaxLength(VERIFICATION_ID_CARD_MAX)
  @MinLength(VERIFICATION_ID_CARD_MIN)
  idCard: string

  @ApiProperty({
    description: '附件列表',
    type: [String],
  })
  @IsString({ each: true })
  @ArrayNotEmpty()
  attachments: string[]
}
