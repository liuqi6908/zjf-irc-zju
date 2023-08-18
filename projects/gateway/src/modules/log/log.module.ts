import { Global, Module } from '@nestjs/common'

import { BullModule } from '@nestjs/bull'
import { LogService } from './log.service'
import { LogController } from './log.controller'
import { LogConsumer } from './log.consumer'

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'log',
    }),
  ],
  controllers: [LogController],
  providers: [LogService, LogConsumer],
  exports: [LogService],
})
export class LogModule {}
