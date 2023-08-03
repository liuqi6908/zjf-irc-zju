import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import type { IVerificationResDto } from 'zjf-types'
import { VerificationHistory } from 'src/entities/verification'

export class VerificationResDto extends SuccessDto implements IVerificationResDto {
  @ApiProperty({ type: () => VerificationHistory })
  data: VerificationHistory
}
