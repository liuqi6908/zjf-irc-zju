import { Injectable } from '@nestjs/common'
import { In, Not, Repository } from 'typeorm'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { permissionDescriptions } from 'zjf-types'
import { Permission } from 'src/entities/permission'
import { objectEntries, objectKeys } from '@catsjuice/utils'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'

import { RoleService } from '../role/role.service'

@Injectable()
export class PermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private readonly _permissionRepo: Repository<Permission>,
    private readonly _roleSrv: RoleService,
  ) {}

  onModuleInit() {
    this._initPermissions()
  }

  private async _initPermissions() {
    await Promise.all(objectEntries(permissionDescriptions).map(async ([name, description]) => {
      // do upsert
      try {
        await this._permissionRepo.save({ name, description })
      }
      catch (err) {
        const sqlError = parseSqlError(err)
        if (sqlError === SqlError.DUPLICATE_ENTRY) {
          // do update
          await this._permissionRepo.update({ name }, { description })
        }
      }
      // delete unused permissions
      await this._permissionRepo.delete({ name: Not(In(objectKeys(permissionDescriptions))) })
    }))

    // init roles after permissions are ready
    await this._roleSrv.initDefaultRoles()
  }

  repo() {
    return this._permissionRepo
  }
}
