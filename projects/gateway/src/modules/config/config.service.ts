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

  repo() {
    return this._sysCfgRepo
  }
}
