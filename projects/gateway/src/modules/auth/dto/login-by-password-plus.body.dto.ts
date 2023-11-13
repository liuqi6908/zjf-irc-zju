import { ApiProperty } from '@nestjs/swagger'

interface ILoginByPasswordPlusBodyDto {
  /** 用户账号 */
  userName: string

  /** 用户密码 */
  passWord: string
}

export class LoginByPasswordPlusBodyDto implements ILoginByPasswordPlusBodyDto {
  @ApiProperty({ description: '用户账号' })
  userName: string

  @ApiProperty({ description: '用户密码' })
  passWord: string
}
