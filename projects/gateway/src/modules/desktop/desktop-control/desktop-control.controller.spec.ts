import { Test, TestingModule } from '@nestjs/testing';
import { DesktopControlController } from './desktop-control.controller';

describe('DesktopControlController', () => {
  let controller: DesktopControlController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesktopControlController],
    }).compile();

    controller = module.get<DesktopControlController>(DesktopControlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
