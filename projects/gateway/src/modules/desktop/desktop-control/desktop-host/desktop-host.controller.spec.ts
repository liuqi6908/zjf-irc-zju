import { Test, TestingModule } from '@nestjs/testing';
import { DesktopHostController } from './desktop-host.controller';

describe('DesktopHostController', () => {
  let controller: DesktopHostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesktopHostController],
    }).compile();

    controller = module.get<DesktopHostController>(DesktopHostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
