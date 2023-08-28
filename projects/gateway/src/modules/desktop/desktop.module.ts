import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { Desktop } from 'src/entities/desktop'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { DesktopQueueHistory } from 'src/entities/desktop-queue-history'

import { DesktopService } from './desktop.service'
import { ZstackService } from './zstack/zstack.service'
import { DesktopController } from './desktop.controller'
import { DesktopRequestService } from './desktop-request/desktop-request.service'
import { DesktopRequestController } from './desktop-request/desktop-request.controller'
import { DesktopQueueHistoryService } from './desktop-queue-history/desktop-queue-history.service'
import { DesktopControlController } from './desktop-control/desktop-control.controller';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Desktop,
      DesktopQueue,
      DesktopQueueHistory,
    ]),
  ],
  controllers: [DesktopController, DesktopRequestController, DesktopControlController],
  providers: [DesktopService, DesktopRequestService, DesktopQueueHistoryService, ZstackService],
  exports: [DesktopService, DesktopRequestService, DesktopQueueHistoryService],
})
export class DesktopModule {}
