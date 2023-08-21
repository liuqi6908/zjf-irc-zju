import { Test, TestingModule } from '@nestjs/testing';
import { DailyCountService } from './daily-count.service';

describe('DailyCountService', () => {
  let service: DailyCountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailyCountService],
    }).compile();

    service = module.get<DailyCountService>(DailyCountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
