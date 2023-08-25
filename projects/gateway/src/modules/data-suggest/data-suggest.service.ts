import { Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSuggestion } from 'src/entities/data-suggestion'

@Injectable()
export class DataSuggestService {
  constructor(
    @InjectRepository(DataSuggestion)
    private readonly _dataSuggestRepo: Repository<DataSuggestion>,
  ) {}

  public repo() {
    return this._dataSuggestRepo
  }
}
