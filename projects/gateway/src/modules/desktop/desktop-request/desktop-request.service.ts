import { LessThan, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import type { User } from 'src/entities/user'
import { InjectRepository } from '@nestjs/typeorm'
import { responseError } from 'src/utils/response'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { DesktopQueueStatus, ErrorCode } from 'zjf-types'
import { parseSqlError } from 'src/utils/sql-error/parse-sql-error'
import type { UserIdDto } from 'src/dto/user-id.dto'
import { NotifyService } from 'src/modules/notify/notify.service'

import type { CreateDesktopRequestBodyDto } from './dto/create-desktop-req.body.dto'

@Injectable()
export class DesktopRequestService {
  constructor(
    @InjectRepository(DesktopQueue)
    private readonly _desktopQueueRepo: Repository<DesktopQueue>,
    private readonly _notifySrv: NotifyService,
  ) {}

  /**
   * 创建一个云桌面使用申请
   * @param userId
   * @param info
   * @returns
   */
  public async createRequest(
    userId: User['id'],
    info: CreateDesktopRequestBodyDto,
  ) {
    try {
      const insertRes = await this._desktopQueueRepo.insert({
        userId,
        attachments: info.attachments,
        requestAt: new Date(),
        duration: info.duration,
      })
      setTimeout(async () => {
        const queue = await this._desktopQueueRepo.findOne({
          where: { userId },
          relations: { user: { verification: true } },
        })
        if (!queue)
          return
        this._notifySrv.notifyNewDesktopRequest(queue)
      })
      return insertRes.identifiers[0]
    }
    catch (err) {
      const sqlErr = parseSqlError(err)
      if (sqlErr === SqlError.DUPLICATE_ENTRY) {
        const desktopQueue = await this._desktopQueueRepo.findOne({
          where: { userId },
        })
        if (desktopQueue) {
          desktopQueue.status === DesktopQueueStatus.Pending
            ? responseError(ErrorCode.DESKTOP_REQUEST_PENDING_EXISTS)
            : desktopQueue.status === DesktopQueueStatus.Queueing
              ? responseError(ErrorCode.DESKTOP_REQUEST_QUEUE_EXISTS)
              : responseError(ErrorCode.DESKTOP_REQUEST_IN_USE_EXISTS)
        }
        responseError(ErrorCode.COMMON_UNEXPECTED_ERROR)
      }
    }
  }

  /**
   * 通过一个云桌面申请
   * @param param
   * @returns
   */
  public async approveRequest(param: UserIdDto) {
    const updateRes = await this._desktopQueueRepo.update(
      { userId: param.userId, status: DesktopQueueStatus.Pending },
      { status: DesktopQueueStatus.Queueing, queueAt: new Date() },
    )
    return updateRes.affected > 0
  }

  /**
   * 获取指定申请前面排队的人数
   * @param queue
   * @returns
   */
  public async getLengthAheadOfQueue(queue?: DesktopQueue) {
    return await this._desktopQueueRepo.count({
      where: {
        status: DesktopQueueStatus.Queueing,
        ...(
          queue
            ? { queueAt: LessThan(queue?.queueAt ?? new Date()) }
            : {}
        ),
      },
    })
  }

  repo() {
    return this._desktopQueueRepo
  }

  qb(alias = 'dq') {
    return this._desktopQueueRepo.createQueryBuilder(alias)
  }
}
