import { ErrorCode } from 'zjf-types'
import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { DataRole } from 'src/entities/data-role'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'

import { DataService } from '../data.service'

import type { UpsertDataRoleBodyDto } from './dto/upsert-data-role.body.dto'

export const visitorRole: DataRole = {
  name: '访客',
  description: '未登录的用户',
}

@Injectable()
export class DataPermissionService implements OnModuleInit {
  constructor(
    @InjectRepository(DataRole)
    private readonly _dataRoleRepo: Repository<DataRole>,
    private readonly _dataSrv: DataService,
  ) {}

  onModuleInit() {
    this._dataRoleRepo.save(visitorRole)
  }

  async deleteRole(name: string) {
    if (name === visitorRole.name)
      responseError(ErrorCode.DATA_PERMISSION_DELETE_VISITOR)
    const deleteRes = await this._dataRoleRepo.delete({ name })
    return deleteRes.affected
  }

  async upsertDataRole(role: UpsertDataRoleBodyDto) {
    const mapId = (arr: string[]) => arr.map(id => ({ id }))

    role.viewableDirectoryIds = Array.from(
      new Set([
        ...(role.viewableDirectoryIds || []),
        ...(role.downloadableDirectoryIds || []),
      ]),
    )

    // 去除无效的目录id
    const dirs = await this._dataSrv.dirRepo().find({
      where: { id: In(role.viewableDirectoryIds) },
    })
    const availableIdsMap = dirs.reduce((map, dir) => {
      map[dir.id] = true
      return map
    }, {} as Record<string, boolean>)

    role.viewableDirectoryIds = role.viewableDirectoryIds.filter(id => availableIdsMap[id])
    role.downloadableDirectoryIds = role.downloadableDirectoryIds.filter(id => availableIdsMap[id])

    const saveInfo: Partial<Record<keyof DataRole, any>> = {
      name: role.name,
      description: role.description || '',
      viewDirectories: mapId(role.viewableDirectoryIds || []),
      downloadDirectories: mapId(role.downloadableDirectoryIds || []),
    }

    await this._dataRoleRepo.save(saveInfo)

    return saveInfo
  }

  dataRoleQB(alias = 'dr') {
    return this._dataRoleRepo.createQueryBuilder(alias)
  }

  dataRoleRepo() {
    return this._dataRoleRepo
  }
}
