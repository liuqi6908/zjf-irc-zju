import { Test, TestingModule } from '@nestjs/testing';
import { DesktopVmController } from './desktop-vm.controller';

describe('DesktopVmController', () => {
  let controller: DesktopVmController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DesktopVmController],
    }).compile();

    controller = module.get<DesktopVmController>(DesktopVmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
