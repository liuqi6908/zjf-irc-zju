import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataField } from 'src/entities/data-field'
import { DataDirectory } from 'src/entities/data-directory'

import { DataService } from './data.service'
import { DataController } from './data.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataDirectory,
      DataField,
    ]),
  ],
  providers: [DataService],
  controllers: [DataController],
  exports: [DataService],
})
export class DataModule {}
