import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSuggestion } from 'src/entities/data-suggestion'

import { DataSuggestService } from './data-suggest.service'
import { DataSuggestController } from './data-suggest.controller'

@Module({
  imports: [TypeOrmModule.forFeature([DataSuggestion])],
  controllers: [DataSuggestController],
  providers: [DataSuggestService],
})
export class DataSuggestModule {}
