import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileExportLarge } from 'src/entities/export/file-export-large.entity'
import { FileExportSmall } from 'src/entities/export/file-export-small.entity'

import { FileModule } from '../file/file.module'
import { ExportService } from './export.service'
import { ExportController } from './export.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FileExportLarge,
      FileExportSmall,
    ]),
    FileModule,
  ],
  providers: [ExportService],
  controllers: [ExportController],
  exports: [ExportService],
})
export class ExportModule {}
