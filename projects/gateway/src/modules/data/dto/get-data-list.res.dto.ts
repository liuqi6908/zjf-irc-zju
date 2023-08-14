import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { DataDirectory } from 'src/entities/data-directory'
import type { IGetDataListResponse } from 'zjf-types'

export class GetDataListResDto
  extends SuccessDto<DataDirectory[]>
  implements IGetDataListResponse {
  @ApiProperty({ type: () => [DataDirectory] })
    data: DataDirectory[]
}
