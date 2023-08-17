import { Module, forwardRef } from '@nestjs/common'

import { DataModule } from '../data/data.module'
import { FileService } from './file.service'
import { FileController } from './file.controller'

@Module({
  imports: [
    forwardRef(() => DataModule),
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
