import { Repository } from 'typeorm'
import { Cms } from 'src/entities/cms'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import type { User } from 'src/entities/user'

@Injectable()
export class CmsService<T> {
  constructor(
    @InjectRepository(Cms)
    private readonly _cmsRepo: Repository<Cms<T>>,
  ) {}

  async upsert(id: string, data: Partial<Cms<T>>, user: User) {
    return await this._cmsRepo.save({
      ...data,
      id,
      lastUpdatedBy: user.id,
    })
  }

  async findOne(id: string) {
    return this._cmsRepo.findOne({ where: { id } })
  }

  qb(alias = 'c') {
    return this._cmsRepo.createQueryBuilder(alias)
  }

  repo() {
    return this._cmsRepo
  }
}
