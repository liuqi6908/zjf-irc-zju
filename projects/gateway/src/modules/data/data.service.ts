import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { objectEntries } from '@catsjuice/utils'
import { dataRootDescriptions } from 'zjf-types'
import type { OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataField } from 'src/entities/data-field'
import { DataDirectory } from 'src/entities/data-directory'

@Injectable()
export class DataService implements OnModuleInit {
  constructor(
    @InjectRepository(DataDirectory)
    private readonly _dataDirRepo: Repository<DataDirectory>,

    @InjectRepository(DataField)
    private readonly _dataFieldRepo: Repository<DataField>,
  ) {}

  async onModuleInit() {
    const roots = objectEntries(dataRootDescriptions).map(([id, name]) => {
      const root = new DataDirectory()
      root.id = id
      root.nameZH = name
      root.nameEN = name
      root.level = 0
      root.order = 0
      root.rootId = id
      return root
    })
    await this._dataDirRepo.save(roots)
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
