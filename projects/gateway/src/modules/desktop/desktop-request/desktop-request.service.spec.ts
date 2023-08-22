import { Test, TestingModule } from '@nestjs/testing';
import { DesktopRequestService } from './desktop-request.service';

describe('DesktopRequestService', () => {
  let service: DesktopRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DesktopRequestService],
    }).compile();

    service = module.get<DesktopRequestService>(DesktopRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
