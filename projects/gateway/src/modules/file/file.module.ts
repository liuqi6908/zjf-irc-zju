import { Module } from '@nestjs/common'

import { DataModule } from '../data/data.module'
import { FileService } from './file.service'
import { FileController } from './file.controller'

@Module({
  imports: [DataModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
