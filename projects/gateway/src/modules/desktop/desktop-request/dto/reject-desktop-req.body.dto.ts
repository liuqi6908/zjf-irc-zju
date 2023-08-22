import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import type { IRejectDesktopReqBodyDto } from 'zjf-types'

export class RejectDesktopReqBodyDto implements IRejectDesktopReqBodyDto {
  @ApiProperty({ description: '驳回的理由' })
  @IsString()
  reason: string
}
