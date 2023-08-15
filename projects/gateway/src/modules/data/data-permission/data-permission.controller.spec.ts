import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { DataPermissionController } from './data-permission.controller'

describe('DataPermissionController', () => {
  let controller: DataPermissionController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataPermissionController],
    }).compile()

    controller = module.get<DataPermissionController>(DataPermissionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
