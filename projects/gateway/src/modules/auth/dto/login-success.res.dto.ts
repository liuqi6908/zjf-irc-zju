import { User } from 'src/entities/user'
import { ApiProperty } from '@nestjs/swagger'
import { SuccessDto } from 'src/dto/success.dto'
import type { ILoginSuccessResData, ILoginSuccessResDto } from 'zjf-types'

class Sign {
  @ApiProperty({
    description: 'JWT 登录凭证',
  })
  access_token: string

  @ApiProperty({
    description: '过期时间戳',
  })
  expireAt: number
}

class LoginSuccessResData implements ILoginSuccessResData {
  @ApiProperty({ description: '用户信息', type: () => User })
  user: User

  @ApiProperty({ description: '登录凭证信息', type: () => Sign })
  sign: Sign
}

export class LoginSuccessResDto extends SuccessDto implements ILoginSuccessResDto {
  @ApiProperty({ type: () => LoginSuccessResData })
  data: LoginSuccessResData
}
