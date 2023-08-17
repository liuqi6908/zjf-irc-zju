import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataRole } from 'src/entities/data-role'
import { DataField } from 'src/entities/data-field'
import { DataDirectory } from 'src/entities/data-directory'

import { FileModule } from '../file/file.module'
import { DataService } from './data.service'
import { DataController } from './data.controller'
import { DataPermissionService } from './data-permission/data-permission.service'
import { DataPermissionController } from './data-permission/data-permission.controller'

@Module({
  imports: [
    forwardRef(() => FileModule),
    TypeOrmModule.forFeature([
      DataDirectory,
      DataField,
      DataRole,
    ]),
  ],
  providers: [DataService, DataPermissionService],
  controllers: [DataController, DataPermissionController],
  exports: [DataService, DataPermissionService],
})
export class DataModule {}
