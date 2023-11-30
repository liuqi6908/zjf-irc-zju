import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataField } from 'src/entities/data-field'
import { DataDirectory } from 'src/entities/data-directory'

import { ErrorCode } from 'zjf-types'
import { ModuleRef } from '@nestjs/core'
import { LogService } from '../log/log.service'
import { RedisService } from '../redis/redis.service'

import type { DataLog, LogDataAction } from '../log/log.service'

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    @InjectRepository(DataDirectory)
    private readonly _dataDirRepo: Repository<DataDirectory>,

    @InjectRepository(DataField)
    private readonly _dataFieldRepo: Repository<DataField>,

    private readonly _redisSrv: RedisService,
    private readonly _modRef: ModuleRef,
  ) {}

  async onModuleInit() {
    // const roots = objectEntries(dataRootDescriptions).map(([id, name]) => {
    //   const root = new DataDirectory()
    //   root.id = id
    //   root.nameZH = name
    //   root.nameEN = name
    //   root.level = 0
    //   root.order = 0
    //   root.rootId = id
    //   return root
    // })
    // await this._dataDirRepo.save(roots)
    this.cacheDir()
  }

  async cacheDir() {
    const client = await this._redisSrv.getClient(RedisType.DATA_DIR_CACHE)

    // 先清空缓存 （只清空当前 db）
    await client.flushDb()

    // 写入新的缓存
    const dirs = await this._dataDirRepo.find()
    dirs.forEach(dir => client.set(dir.id, JSON.stringify(dir)))
  }

  async getDirCache(id: string) {
    const client = await this._redisSrv.getClient(RedisType.DATA_DIR_CACHE)
    const dir = await client.get(id)
    try {
      return JSON.parse(dir)
    }
    catch (e) {
      return null
    }
  }

  /**
   * 获取数据目录
   * @param id
   */
  public async getDataDirectory(id: string) {
    const dataDirectory = await this._dataDirRepo.findOne({ where: { id } })
    let code = 200
    if (!dataDirectory)
      code = ErrorCode.DATA_DIRECTORY_NOT_FOUND
    else if (dataDirectory.level !== 4)
      code = ErrorCode.DATA_TABLE_MANIPULATE_ONLY
    return {
      code,
      dataDirectory,
    }
  }

  public async saveLog(
    options: {
      dataDirectory: DataDirectory
      action: LogDataAction
      status: number
      user?: User
      ip: string
    },
  ) {
    // 非表格的下载/预览。不记录
    if (options.dataDirectory?.level !== 4)
      return

    const tableId = options.dataDirectory.id
    const moduleId = options.dataDirectory.parentId
    const subDbId = (await this.getDirCache(options.dataDirectory.parentId))?.parentId
    const dbId = (await this.getDirCache(subDbId))?.parentId
    const rootId = options.dataDirectory.rootId

    const { dataDirectory, ...logOptions } = options

    const log: DataLog = {
      ...logOptions,
      target: {
        tableId,
        moduleId,
        subDbId,
        dbId,
        rootId,
      },
      time: new Date(),
    }
    const logSrv = this._modRef.get(LogService, { strict: false })
    logSrv.log(log)
  }

  dirQB(alias = 'dd') {
    return this._dataDirRepo.createQueryBuilder(alias)
  }

  fieldQB(alias = 'df') {
    return this._dataFieldRepo.createQueryBuilder(alias)
  }

  dirRepo() {
    return this._dataDirRepo
  }

  fieldRepo() {
    return this._dataFieldRepo
  }
}
