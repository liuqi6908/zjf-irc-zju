import { Test, TestingModule } from '@nestjs/testing';
import { EsAnalyzerService } from './es-analyzer.service';

describe('EsAnalyzerService', () => {
  let service: EsAnalyzerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EsAnalyzerService],
    }).compile();

    service = module.get<EsAnalyzerService>(EsAnalyzerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
