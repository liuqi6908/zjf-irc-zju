import { Module } from '@nestjs/common'
import { Work } from 'src/entities/work'
import { TypeOrmModule } from '@nestjs/typeorm'

import { FileModule } from '../file/file.module'
import { WorkService } from './work.service'
import { WorkController } from './work.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Work]),
    FileModule,
  ],
  providers: [WorkService],
  controllers: [WorkController],
  exports: [WorkService],
})
export class WorkModule {}
