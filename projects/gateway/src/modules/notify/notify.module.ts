import { Module } from '@nestjs/common'

import { EmailModule } from '../email/email.module'
import { PermissionModule } from '../permission/permission.module'
import { NotifyService } from './notify.service'

@Module({
  imports: [PermissionModule, EmailModule],
  providers: [NotifyService],
  exports: [NotifyService],
})
export class NotifyModule {}
