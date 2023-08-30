import { BullModule } from '@nestjs/bull'
import { Global, Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DailyCount } from 'src/entities/daily-count.entity'

import { DataModule } from '../data/data.module'
import { LogService } from './log.service'
import { LogConsumer } from './log.consumer'
import { LogController } from './log.controller'
import { DailyCountService } from './daily-count/daily-count.service'

@Global()
@Module({
  imports: [
    forwardRef(() => DataModule),
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
