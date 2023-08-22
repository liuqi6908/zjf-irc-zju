import { Test, TestingModule } from '@nestjs/testing';
import { DesktopRequestController } from './desktop-request.controller';

describe('DesktopRequestController', () => {
  let controller: DesktopRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesktopRequestController],
    }).compile();

    controller = module.get<DesktopRequestController>(DesktopRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
