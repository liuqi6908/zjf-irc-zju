import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataRole } from 'src/entities/data-role'
import { DataField } from 'src/entities/data-field'
import { DataDirectory } from 'src/entities/data-directory'

import { DataService } from './data.service'
import { DataController } from './data.controller'
import { DataPermissionService } from './data-permission/data-permission.service'
import { DataPermissionController } from './data-permission/data-permission.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DataDirectory,
      DataField,
      DataRole,
    ]),
  ],
  providers: [DataService, DataPermissionService],
  controllers: [DataController, DataPermissionController],
  exports: [DataService],
})
export class DataModule {}
