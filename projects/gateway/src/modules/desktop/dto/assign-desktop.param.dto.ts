import { Mixin } from 'ts-mixer'
import { UserIdDto } from '../../../dto/user-id.dto'
import { DesktopIdDto } from '../../../dto/id/desktop.dto'

export class AssignDesktopParamDto extends Mixin(
  DesktopIdDto,
  UserIdDto,
) {}
