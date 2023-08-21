import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DailyCount } from 'src/entities/daily-count.entity'

@Injectable()
export class DailyCountService {
  constructor(
    @InjectRepository(DailyCount)
    private readonly _dailyCountRepo: Repository<DailyCount>,
  ) {}

  private _getDate(src = new Date()) {
    const year = src.getFullYear()
    const month = src.getMonth() + 1
    const date = src.getDate()

    const id = `${year}-${month}-${date}`
    return { id, year, month, date }
  }

  async recordAccess() {
    const { id, year, month, date } = this._getDate()
    try {
      const updateRes = await this._dailyCountRepo.increment({ id }, 'access', 1)
      if (!updateRes.affected)
        throw new Error('not affected')
    }
    catch (err) {
      await this._dailyCountRepo.insert({ id, year, month, date })
    }
  }

  async getAccessLast7Days() {
    const infos = []
    for (let i = 0; i < 7; i++) {
      const info = this._getDate(new Date(Date.now() - i * 24 * 60 * 60 * 1000))
      infos.push(info)
    }
    const counts = await this._dailyCountRepo.find({
      where: { id: In(infos.map(i => i.id)) },
    })
    return infos.map(info => counts.find(c => c.id === info.id) || { ...info, access: 0 })
  }

  async getAccessToday() {
    const { id } = this._getDate()
    return Number(
      (await this._dailyCountRepo.findOne({ where: { id } })).access || 0,
    )
  }

  async getAccessTotal() {
    return await this._dailyCountRepo.sum('access') || 0
  }
}
