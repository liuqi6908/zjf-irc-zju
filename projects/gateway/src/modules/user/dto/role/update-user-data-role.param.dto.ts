import { Mixin } from 'ts-mixer'
import { UserIdDto } from 'src/dto/user-id.dto'
import { DataRoleNameOptionalDto } from 'src/dto/id/data-role.dto'

export class UpdateUserDataRoleParamDto extends Mixin(
  UserIdDto,
  DataRoleNameOptionalDto,
) {}
