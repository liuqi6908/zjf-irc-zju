import { Module } from '@nestjs/common'
import { Desktop } from 'src/entities/desktop'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DesktopQueue } from 'src/entities/desktop-queue'
import { DesktopQueueHistory } from 'src/entities/desktop-queue-history'

import { DesktopService } from './desktop.service'
import { DesktopController } from './desktop.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Desktop,
      DesktopQueue,
      DesktopQueueHistory,
    ]),
  ],
  controllers: [DesktopController],
  providers: [DesktopService],
  exports: [DesktopService],
})
export class DesktopModule {}
