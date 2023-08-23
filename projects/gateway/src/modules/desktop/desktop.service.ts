import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { objectPick } from '@catsjuice/utils'
import { Desktop } from 'src/entities/desktop'
import { InjectRepository } from '@nestjs/typeorm'

import type { CreateDesktopBodyDto } from './dto/create-desktop.body.dto'

@Injectable()
export class DesktopService {
  constructor(
    @InjectRepository(Desktop)
    private readonly _desktopRepo: Repository<Desktop>,
  ) {}

  public async createDesktop(body: CreateDesktopBodyDto) {
    const insertRes = await this._desktopRepo.insert({
      ...objectPick(body, [
        'accessUrl', 'account', 'expiredAt', 'id', 'internalIp', 'password',
      ]),
      expiredAt: body.expiredAt ? new Date(body.expiredAt) : new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    })
    return insertRes.identifiers[0].id
  }

  repo() {
    return this._desktopRepo
  }

  qb(alias = 'd') {
    return this._desktopRepo.createQueryBuilder(alias)
  }
}
