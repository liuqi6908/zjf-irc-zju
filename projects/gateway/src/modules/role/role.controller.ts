import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { HasPermission } from 'src/guards/permission.guard'
import { ErrorCode, PermissionType } from 'zjf-types'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import { responseError } from 'src/utils/response'

import { RoleService } from './role.service'
import { UpsertRoleBodyDto } from './dto/upsert-role.body.dto'

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

  @ApiOperation({
    summary: '创建/更新角色',
    description: '角色名称为唯一标识，如果角色名称存在，则会更新角色信息',
  })
  @HasPermission([PermissionType.ROLE_CREATE, PermissionType.ROLE_UPDATE], 'AND')
  @Post('upsert')
  public async upsertRole(@Body() body: UpsertRoleBodyDto) {
    return await this._roleSrv.upsertRole(body)
  }

  @ApiOperation({
    summary: '删除角色',
    description: '删除角色时，如果角色已关联用户，则会删除失败',
  })
  @ApiParam({ name: 'roleName', description: '角色名称' })
  @HasPermission(PermissionType.ROLE_DELETE)
  @Delete(':roleName')
  public async deleteRole(@Param('roleName') roleName: string) {
    try {
      return await this._roleSrv.deleteRole(roleName)
    }
    catch (err) {
      const sqlError = parseSqlError(err)
      if (sqlError === SqlError.FOREIGN_KEY_CONSTRAINT_FAILS)
        responseError(ErrorCode.ROLE_IN_USAGE)
      throw err
    }
  }
}
