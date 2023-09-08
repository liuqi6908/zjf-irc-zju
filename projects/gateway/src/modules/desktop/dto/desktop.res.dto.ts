import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { Desktop } from 'src/entities/desktop'

export class DesktopResDto extends SuccessDto<Desktop> {
  @ApiProperty({ type: () => Desktop })
  data: Desktop
}
