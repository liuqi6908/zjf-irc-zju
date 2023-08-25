import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { DataSuggestController } from './data-suggest.controller'

describe('DataSuggestController', () => {
  let controller: DataSuggestController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataSuggestController],
    }).compile()

    controller = module.get<DataSuggestController>(DataSuggestController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
