import { Repository } from 'typeorm'
import { Role } from 'src/entities/role'
import { defaultRoles } from 'zjf-types'
import { Injectable } from '@nestjs/common'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class RoleService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly _roleRepo: Repository<Role>,
  ) {}

  onModuleInit() {
    // this._initDefaultRoles()
    // do not init here, init after permission init in "permission.service.ts"
  }

  public async initDefaultRoles() {
    await this._roleRepo.save(defaultRoles)
  }
}
