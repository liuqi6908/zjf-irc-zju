import { User } from 'src/entities/user'
import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import type { IUserProfileResDto } from 'zjf-types'

export class UserProfileResponseDto extends SuccessDto implements IUserProfileResDto {
  @ApiProperty({ type: () => User })
  data: User
}
