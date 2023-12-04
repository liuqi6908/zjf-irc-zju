import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Config } from 'src/entities/config'
import { Repository } from 'typeorm'

@Injectable()
export class SysConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly _sysCfgRepo: Repository<Config>,
  ) {}

  async getConfig(version: string) {
    return (await this._sysCfgRepo.findOne({
      where: { version },
      select: ['config'],
    }))?.config
  }

  repo() {
    return this._sysCfgRepo
  }
}
