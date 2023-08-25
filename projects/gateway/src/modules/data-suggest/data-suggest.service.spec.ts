import { Test, TestingModule } from '@nestjs/testing';
import { DataSuggestService } from './data-suggest.service';

describe('DataSuggestService', () => {
  let service: DataSuggestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataSuggestService],
    }).compile();

    service = module.get<DataSuggestService>(DataSuggestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
