import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { VerifiedRequiredToken } from 'src/guards/verify-required-token.guard'

import { ZstackService } from '../../zstack/zstack.service'

@VerifiedRequiredToken()
@ApiTags('DesktopHost | 云桌面物理机')
@Controller('desktop-host')
export class DesktopHostController {
  constructor(private readonly _zstackSrv: ZstackService) {}

  @ApiOperation({ summary: '获取云桌面物理机列表' })
  @Get()
  public async getHostList() {
    return this._zstackSrv.getHostList()
  }

  @ApiOperation({ summary: '获取指定物理机的 CPU、内存分配' })
  @ApiParam({ name: 'hostId', description: '物理机ID' })
  @Get(':hostId')
  public async getHostAllocation(@Param('hostId') hostId: string) {
    return this._zstackSrv.getHostCpuMem(hostId)
  }

  @ApiOperation({ summary: '获取指定物理机的时序数据' })
  @ApiParam({ name: 'hostId', description: '物理机ID' })
  @Get('time-series/:hostId')
  public async getHostTimeSeries(@Param('hostId') hostId: string) {
    return this._zstackSrv.getHostMonitor(hostId)
  }

  @ApiOperation({ summary: '获取集群整体的存储使用情况' })
  @Get('cluster/storage')
  public async getClusterStorage() {
    return await this._zstackSrv.getClusterStorage()
  }
}
