import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { objectOmit } from '@catsjuice/utils'
import { InjectRepository } from '@nestjs/typeorm'
import type { DesktopQueue } from 'src/entities/desktop-queue'
import { DesktopQueueHistory } from 'src/entities/desktop-queue-history'

import { DesktopRequestService } from '../desktop-request/desktop-request.service'

@Injectable()
export class DesktopQueueHistoryService {
  constructor(
    @InjectRepository(DesktopQueueHistory)
    private readonly _desktopQueHisRepo: Repository<DesktopQueueHistory>,
    private readonly _desktopReqSrv: DesktopRequestService,
  ) {}

  /**
   * 将一个云桌面申请移动到历史记录中
   */
  public async mv2history(
    queue: DesktopQueue,
    status: DesktopQueueHistory['status'],
    options?: {
      rejectReason?: string
    },
  ) {
    // 插入历史记录
    await this._desktopQueHisRepo.insert({
      ...objectOmit(queue, ['createdAt', 'status', 'updatedAt', 'user']),
      status,
      rejectReason: options?.rejectReason,
    })

    // 删除进行中的申请
    await this._desktopReqSrv.repo().delete({ userId: queue.userId })

    return true
  }

  repo() {
    return this._desktopQueHisRepo
  }

  qb(alias = 'dqh') {
    return this._desktopQueHisRepo.createQueryBuilder(alias)
  }
}
