import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { DailyCount } from 'src/entities/daily-count.entity'

export class GetAccessLast7DaysResDto extends SuccessDto<DailyCount[]> {
  @ApiProperty({ type: () => [DailyCount] })
  data: DailyCount[]
}
