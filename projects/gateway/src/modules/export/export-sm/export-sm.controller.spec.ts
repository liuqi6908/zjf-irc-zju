import { Test, TestingModule } from '@nestjs/testing';
import { ExportSmController } from './export-sm.controller';

describe('ExportSmController', () => {
  let controller: ExportSmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportSmController],
    }).compile();

    controller = module.get<ExportSmController>(ExportSmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
