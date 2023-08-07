import { NicknameOptionalDto } from 'src/dto/nickname.dto'
import type { IUpdateProfileOwnBodyDto } from 'zjf-types'

export class UpdateProfileOwnBodyDto
  extends NicknameOptionalDto
  implements IUpdateProfileOwnBodyDto {}
