import { Mixin } from 'ts-mixer'
import { UserIdDto } from 'src/dto/user-id.dto'
import { RoleNameOptionalDto } from 'src/dto/id/role.dto'

export class UpdateUserRoleParamDto extends Mixin(
  UserIdDto,
  RoleNameOptionalDto,
) {}
