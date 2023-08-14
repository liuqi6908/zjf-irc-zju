import { Repository } from 'typeorm'
import { Role } from 'src/entities/role'
import { defaultRoles } from 'zjf-types'
import { Injectable } from '@nestjs/common'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserService } from '../user/user.service'

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
    private readonly _userSrv: UserService,
  ) {}

  onModuleInit() {
    // this._initDefaultRoles()
    // do not init here, init after permission init in "permission.service.ts"
  }

  public async initDefaultRoles() {
    // 初始化所有的默认角色
    await this._roleRepo.save(defaultRoles)
    // 将所有超级管理员的角色设置为 root
    await this._userSrv.repo().update({ isSysAdmin: true }, { roleName: 'root' })
  }

  qb(alias = 'r') {
    return this._roleRepo.createQueryBuilder(alias)
  }

  repo() {
    return this._roleRepo
  }
}