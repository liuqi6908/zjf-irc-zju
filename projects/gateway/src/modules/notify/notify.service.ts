import { In } from 'typeorm'
import { Injectable } from '@nestjs/common'
import type { Desktop } from 'src/entities/desktop'
import { getUserName } from 'src/utils/get-user-name'
import { PermissionType, VerificationStatus } from 'zjf-types'
import type { DesktopQueue } from 'src/entities/desktop-queue'
import type { VerificationHistory } from 'src/entities/verification'
import type { FileExportLarge } from 'src/entities/export/file-export-large.entity'
import { getDesktopExpireAdminHTML } from 'src/utils/html/templates/desktop-expire-admin'
import { getVerificationApprovedHTML } from 'src/utils/html/templates/verification-approved'
import { getVerificationRejectedHTML } from 'src/utils/html/templates/verification-rejected'

import { UserService } from '../user/user.service'
import { EmailService } from '../email/email.service'
import { PermissionService } from '../permission/permission.service'
import { getNewExportLgHTML } from '../../utils/html/templates/new-export-lg'
import { getDesktopRequestHTML } from '../../utils/html/templates/desktop-req'
import { getNewVerificationHTML } from '../../utils/html/templates/new-verification'
import { getDesktopAssignedHTML } from '../../utils/html/templates/desktop-assigned'
import { getDesktopExpireUserHTML } from '../../utils/html/templates/desktop-expire-user'
import { getDesktopInfoChangedHTML } from '../../utils/html/templates/desktop-info-changed'

@Injectable()
export class NotifyService {
  constructor(
    private readonly _permissionSrv: PermissionService,
    private readonly _emailSrv: EmailService,
    private readonly _userSrv: UserService,
  ) {}

  public async getUserEmailsThatHasPermission(
    permissionNames: PermissionType | PermissionType[],
  ) {
    const names = Array.isArray(permissionNames) ? permissionNames : [permissionNames]
    const permissions = await this._permissionSrv.repo().find({
      where: { name: In(names) },
      relations: { roles: { users: true } },
    })

    const users = permissions.flatMap(p => p.roles.flatMap(r => r.users))
    return Array.from(new Set(users.map(u => u.email))).filter(Boolean)
  }

  /**
   * 通知云桌面即将过期
   * @param desktop
   * @param ahead
   */
  public async notifyDesktopExpired(desktop: Desktop) {
    await Promise.all([
      (async () => {
        const emails = await this.getUserEmailsThatHasPermission([
          PermissionType.DESKTOP_ASSIGN,
        ])
        this._emailSrv.send({
          to: emails,
          ...getDesktopExpireAdminHTML(desktop),
        })
      })(),
      (async () => {
        const email = desktop?.user?.email
        if (!email)
          return
        this._emailSrv.send({
          to: email,
          ...getDesktopExpireUserHTML(desktop),
        })
      })(),
    ])
  }

  /**
   * 新的用户认证申请通知
   * @param verification
   */
  public async notifyNewVerification(verification: VerificationHistory) {
    const emails = await this.getUserEmailsThatHasPermission([
      PermissionType.VERIFICATION_LIST_ALL,
    ])
    this._emailSrv.send({
      to: emails,
      ...getNewVerificationHTML(verification),
    })
  }

  /**
   * 新的云桌面使用申请
   * @param desktopQueue
   */
  public async notifyNewDesktopRequest(desktopQueue: DesktopQueue) {
    const emails = await this.getUserEmailsThatHasPermission([
      PermissionType.DESKTOP_REQUEST_QUERY,
    ])
    this._emailSrv.send({
      to: emails,
      ...getDesktopRequestHTML({
        name: getUserName(desktopQueue.user),
      }),
    })
  }

  /**
   * 通知用户已分配云桌面
   * @param desktop
   */
  public async notifyUserDesktopAssigned(desktop: Desktop) {
    this._emailSrv.send({
      to: desktop.user.email,
      ...getDesktopAssignedHTML(desktop),
    })
  }

  public async notifyUserDesktopInfoChanged(desktop: Desktop) {
    this._emailSrv.send({
      to: desktop.user.email,
      ...getDesktopInfoChangedHTML(desktop),
    })
  }

  /**
   * 当认证状态改变时通知用户
   * @param verification
   * @returns
   */
  public async notifyVerificationStatusChanged(
    verification: VerificationHistory,
  ) {
    const user = await this._userSrv.repo().findOne({ where: { id: verification.founderId } })
    if (!user?.email)
      return

    if (
      verification.status !== VerificationStatus.APPROVED
      && verification.status !== VerificationStatus.REJECTED
    )
      return

    this._emailSrv.send({
      to: user.email,
      ...(
        verification.status === VerificationStatus.APPROVED
          ? getVerificationApprovedHTML(verification)
          : getVerificationRejectedHTML(verification)
      ),
    })
  }

  public async notifyNewFileExportLg(info: FileExportLarge) {
    const { desktop, ip } = info
    const desktopName = desktop?.id ? `${desktop.id}` : `未知IP (${ip})`
    const emails = await this.getUserEmailsThatHasPermission([
      PermissionType.EXPORT_LG_QUERY_ALL,
    ])
    return this._emailSrv.send({
      to: emails,
      ...getNewExportLgHTML(desktopName),
    })
  }
}
