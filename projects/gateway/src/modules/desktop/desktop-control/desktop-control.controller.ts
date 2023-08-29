import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

import { ZstackService } from '../zstack/zstack.service'

@ApiTags('DesktopControl | 云桌面控制/管理')
@Controller('desktop-control')
export class DesktopControlController {
  constructor(
    private readonly _zstackSrv: ZstackService,
  ) {}

  @ApiOperation({ summary: '获取全部物理机的 CPU、内存分配 ' })
  @Get('host/cpu-memory-allocation')
  public async getHostAllocation() {
    return await this._zstackSrv.getAllHostCpuMem()
  }

  @ApiOperation({ summary: '获取虚拟机状态' })
  @ApiParam({ name: 'id', description: '虚拟机ID' })
  @Get('vm/state/:id')
  public async getVMState(@Param('id') id: string) {
    return await this._zstackSrv.getVMState(id)
  }
}
