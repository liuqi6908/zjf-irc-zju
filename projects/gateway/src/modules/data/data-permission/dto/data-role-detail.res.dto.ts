import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import { DataRole } from 'src/entities/data-role'
import type { IDataRoleDetailResDto } from 'zjf-types'

export class DataRoleDetailResDto
  extends SuccessDto<DataRole>
  implements IDataRoleDetailResDto {
  @ApiProperty({ type: () => DataRole })
  data: DataRole
}
