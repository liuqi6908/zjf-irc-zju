import { In } from 'typeorm'
import { PermissionType } from 'zjf-types'
import { Injectable } from '@nestjs/common'
import type { VerificationHistory } from 'src/entities/verification'

import { EmailService } from '../email/email.service'
import { PermissionService } from '../permission/permission.service'
import { getNewVerificationHTML } from '../../utils/html/templates/new-verification'

@Injectable()
export class NotifyService {
  constructor(
    private readonly _permissionSrv: PermissionService,
    private readonly _emailSrv: EmailService,
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
}
