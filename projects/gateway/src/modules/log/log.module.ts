import { Global, Module } from '@nestjs/common'

import { BullModule } from '@nestjs/bull'
import { LogService } from './log.service'
import { LogController } from './log.controller'

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'log',
    }),
  ],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
