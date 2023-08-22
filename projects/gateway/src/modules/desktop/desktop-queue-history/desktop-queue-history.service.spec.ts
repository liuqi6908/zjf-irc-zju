import { Test, TestingModule } from '@nestjs/testing';
import { DesktopQueueHistoryService } from './desktop-queue-history.service';

describe('DesktopQueueHistoryService', () => {
  let service: DesktopQueueHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesktopQueueHistoryService],
    }).compile();

    service = module.get<DesktopQueueHistoryService>(DesktopQueueHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
