import { In, Repository } from 'typeorm'
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

  public findActiveDesktopByIP(ip: string) {
    return this._desktopRepo.findOne({
      where: { internalIp: ip, disabled: false },
    })
  }

  /**
   * 通过 ip 列表匹配对应的云桌面信息，并将其附加到列表中
   * @param list
   * @param ipKey
   * @param desktopKey
   * @returns
   */
  public async appendDesktop<T>(
    list: T[],
    ipKey: keyof T,
    desktopKey = 'desktop',
  ) {
    const ips = Array.from(new Set(list.map(item => item[ipKey])))
    const desktops = await this.repo().find({
      where: { internalIp: In(ips), disabled: false },
    })
    const desktopIpMap = new Map<string, Desktop>()
    desktops.forEach(desktop => desktopIpMap.set(desktop.internalIp, desktop))
    list.forEach(item => item[desktopKey] = desktopIpMap.get(item[ipKey] as string))
    return list
  }

  repo() {
    return this._desktopRepo
  }

  qb(alias = 'd') {
    return this._desktopRepo.createQueryBuilder(alias)
  }
}
