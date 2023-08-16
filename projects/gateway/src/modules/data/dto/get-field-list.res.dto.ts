import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { DataField } from 'src/entities/data-field'
import type { IGetDataFieldListResDto } from 'zjf-types'

export class GetDataFieldListResDto
  extends SuccessDto<DataField[]>
  implements IGetDataFieldListResDto {
  @ApiProperty({ description: '数据字段列表', type: () => [DataField] })
  data: DataField[]
}
