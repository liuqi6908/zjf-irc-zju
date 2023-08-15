import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import { DataPermissionService } from './data-permission.service'

describe('DataPermissionService', () => {
  let service: DataPermissionService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPermissionService],
    }).compile()

    service = module.get<DataPermissionService>(DataPermissionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
