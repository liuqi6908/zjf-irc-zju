import { BullModule } from '@nestjs/bull'
import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DailyCount } from 'src/entities/daily-count.entity'

import { LogService } from './log.service'
import { LogConsumer } from './log.consumer'
import { LogController } from './log.controller'
import { DailyCountService } from './daily-count/daily-count.service'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      DailyCount,
    ]),
    BullModule.registerQueue({
      name: 'log',
    }),
  ],
  controllers: [LogController],
  providers: [LogService, LogConsumer, DailyCountService],
  exports: [LogService, DailyCountService],
})
export class LogModule {}
