import { In } from 'typeorm'
import { PermissionType, VerificationStatus } from 'zjf-types'
import { Injectable } from '@nestjs/common'
import type { VerificationHistory } from 'src/entities/verification'

import { getVerificationApprovedHTML } from 'src/utils/html/templates/verification-approved'
import { getVerificationRejectedHTML } from 'src/utils/html/templates/verification-rejected'
import type { FileExportLarge } from 'src/entities/export/file-export-large.entity'
import { EmailService } from '../email/email.service'
import { PermissionService } from '../permission/permission.service'
import { getNewVerificationHTML } from '../../utils/html/templates/new-verification'
import { UserService } from '../user/user.service'
import { getNewExportLgHTML } from '../../utils/html/templates/new-export-lg'

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
