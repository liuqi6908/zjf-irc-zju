import { Test, TestingModule } from '@nestjs/testing';
import { ExportLgController } from './export-lg.controller';

describe('ExportLgController', () => {
  let controller: ExportLgController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportLgController],
    }).compile();

    controller = module.get<ExportLgController>(ExportLgController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
