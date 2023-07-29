import { User } from 'src/entities/user'
import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import type { ICreateUserResDto } from 'zjf-types'

export class CreateUserResDto extends SuccessDto<ICreateUserResDto> {
  @ApiProperty({ description: '创建的用户信息', type: () => User })
  data: User
}
