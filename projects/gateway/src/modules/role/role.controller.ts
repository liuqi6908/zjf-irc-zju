import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { HasPermission } from 'src/guards/permission.guard'
import { PermissionType } from 'zjf-types'

import { RoleService } from './role.service'

@ApiTags('Role | 角色')
@Controller('role')
export class RoleController {
  constructor(
    private readonly _roleSrv: RoleService,
  ) {}

  @ApiOperation({ summary: '获取全部角色列表' })
  @HasPermission(PermissionType.ROLE_QUERY)
  @Get('list')
  public async getRoles() {
    return this._roleSrv.repo().find({
      where: {},
      relations: { permissions: true },
    })
  }
}
