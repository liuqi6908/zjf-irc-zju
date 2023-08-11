import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { Cms } from 'src/entities/cms'
import type { ICmsResponseDto } from 'zjf-types'

export class CmsResDto<T>
  extends SuccessDto<Cms<T>>
  implements ICmsResponseDto<T> {
  @ApiProperty({ type: () => Cms })
    data: Cms<T>
}
