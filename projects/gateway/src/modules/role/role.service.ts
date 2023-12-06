import { Repository } from 'typeorm'
import { Role } from 'src/entities/role'
import { ErrorCode, defaultRoles } from 'zjf-types'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'

import { UserService } from '../user/user.service'
import { PermissionService } from '../permission/permission.service'
import type { UpsertRoleBodyDto } from './dto/upsert-role.body.dto'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
    private readonly _userSrv: UserService,
    @Inject(forwardRef(() => PermissionService))
    private readonly _permissionSrv: PermissionService,
  ) {}

  /**
   * 初始化默认角色
   */
  public async initDefaultRoles() {
    // 初始化所有的默认角色
    await this._roleRepo.save(defaultRoles)
    // 将所有超级管理员的角色设置为 root
    await this._userSrv.repo().update({ isSysAdmin: true }, { roleName: 'root' })
  }

  /**
   * 创建/更新角色
   * @param role
   * @returns
   */
  async upsertRole(role: UpsertRoleBodyDto) {
    const permissions = await this._permissionSrv.repo().find({ where: {} })
    const saveInfo: Role = {
      ...role,
      permissions: permissions.filter(v => role.permissions?.includes(v.name)),
    }
    await this._roleRepo.save(saveInfo)
    return saveInfo
  }

  /**
   * 删除角色
   * @param name
   * @returns
   */
  async deleteRole(name: string) {
    if (defaultRoles.map(v => v.name).includes(name))
      responseError(ErrorCode.ROLE_DELETE_ROOT)
    const deleteRes = await this._roleRepo.delete({ name })
    return deleteRes.affected
  }

  qb(alias = 'r') {
    return this._roleRepo.createQueryBuilder(alias)
  }

  repo() {
    return this._roleRepo
  }
}
