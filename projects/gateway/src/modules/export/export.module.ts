import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileExportLarge } from 'src/entities/export/file-export-large.entity'
import { FileExportSmall } from 'src/entities/export/file-export-small.entity'

import { FileModule } from '../file/file.module'
import { EmailModule } from '../email/email.module'
import { NotifyModule } from '../notify/notify.module'
import { DesktopModule } from '../desktop/desktop.module'
import { ExportService } from './export.service'
import { ExportSmController } from './export-sm/export-sm.controller'
import { ExportLgController } from './export-lg/export-lg.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileExportLarge,
      FileExportSmall,
    ]),
    FileModule,
    EmailModule,
    NotifyModule,
    DesktopModule,
  ],
  providers: [ExportService],
  controllers: [ExportSmController, ExportLgController],
  exports: [ExportService],
})
export class ExportModule {}
