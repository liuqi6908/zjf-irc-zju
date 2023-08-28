import { Test, TestingModule } from '@nestjs/testing';
import { ZstackService } from './zstack.service';

describe('ZstackService', () => {
  let service: ZstackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZstackService],
    }).compile();

    service = module.get<ZstackService>(ZstackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
