import { ApiProperty } from '@nestjs/swagger'
import type { IRejectVerificationBodyDto } from 'zjf-types'
import { IsString, MaxLength, MinLength } from 'class-validator'
import { VERIFICATION_REJECT_REASON_MAX, VERIFICATION_REJECT_REASON_MIN } from 'zjf-types'

export class RejectVerificationBodyDto implements IRejectVerificationBodyDto {
  @ApiProperty({
    description: '驳回的原因',
    minLength: VERIFICATION_REJECT_REASON_MIN,
    maxLength: VERIFICATION_REJECT_REASON_MAX,
  })
  @IsString()
  @MaxLength(VERIFICATION_REJECT_REASON_MAX)
  @MinLength(VERIFICATION_REJECT_REASON_MIN)
  reason: string
}
