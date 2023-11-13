import { PasswordDecorator } from 'src/dto/password.dto'
import type { IUpdatePasswordByOldBodyDto } from 'zjf-types'

export class UpdatePasswordByOldBodyDto implements IUpdatePasswordByOldBodyDto {
  @PasswordDecorator(false)
  newPassword: string

  @PasswordDecorator(true)
  oldPassword?: string
}
