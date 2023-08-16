import { Reflector } from '@nestjs/core'
import { RoleService } from 'src/modules/role/role.service'
import { getReflectorValue } from 'src/utils/reflector-value'
import type { CanActivate, ExecutionContext } from '@nestjs/common'
import { Injectable, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { DataPermissionService, visitorRole } from 'src/modules/data/data-permission/data-permission.service'

import { PermissionType } from 'zjf-types'
import { PermissionGuard } from './permission.guard'

export type DataRolePermissionScope = 'viewDirectories' | 'downloadDirectories'

@Injectable()
export class DataRolePermission extends PermissionGuard implements CanActivate {
  constructor(
    public readonly reflector: Reflector,
    public readonly roleSrv: RoleService,
    public readonly dataPSrv: DataPermissionService,
  ) {
    super(reflector, roleSrv)
  }

  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: FastifyRequest = context.switchToHttp().getRequest()
    await super.validatePermission(req, [], 'AND')

    const queryScopes = getReflectorValue<DataRolePermissionScope[]>(
      this.reflector,
      context,
      'dataRoleScopes',
      ['viewDirectories'],
    )

    const user = req.raw.user

    // 检查用户是否拥有管理权限，有管理权限直接返回
    const isAdmin = user?.role?.permissions?.some(p => p.name === PermissionType.DATA_PERMISSION_QUERY)
    if (isAdmin) {
      req.dataRole = '*'
      return true
    }

    const dataRoleName = user?.dataRoleName || visitorRole.name
    const dataRole = await this.dataPSrv.dataRoleRepo().findOne({
      where: { name: dataRoleName },
      relations: queryScopes,
    })
    req.dataRole = dataRole

    return true
  }
}

/**
 * 检查当前登录用户的数据角色，并且将信息记录到 req.dataRole
 * @param scopes
 * @returns
 */
export function DataRoleCheck(...scopes: DataRolePermissionScope[]) {
  return applyDecorators(
    UseGuards(DataRolePermission),
    SetMetadata('dataRoleScopes', scopes),
  )
}
