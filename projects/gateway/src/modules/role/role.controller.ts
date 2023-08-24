import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { RoleService } from './role.service'

@ApiTags('Role | 角色')
@Controller('role')
export class RoleController {
  constructor(
    private readonly _roleSrv: RoleService,
  ) {}

  @ApiOperation({ summary: '获取全部角色列表' })
  @Get('list')
  public async getRoles() {
    return this._roleSrv.repo().find({
      where: {},
      relations: { permissions: true },
    })
  }
}
