import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { VerifiedRequired } from 'src/guards/verify-required.guard'
import { AllowDesktopOperate } from 'src/guards/desktop-operate-allowed.guard'

import { ZstackService } from '../../zstack/zstack.service'

@VerifiedRequired()
@ApiTags('DesktopVm | 云桌面虚拟机')
@Controller('desktop-vm')
export class DesktopVmController {
  constructor(private readonly _zstackSrv: ZstackService) {}

  @ApiOperation({ summary: '云桌面总览', description: '返回云主机总数、开机数量、关机数量' })
  @Get()
  public async getVMOverview() {
    return await this._zstackSrv.vmOverview()
  }

  @ApiOperation({ summary: '获取指定虚拟机的状态' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Get(':desktopId')
  public async getVMState(@Param('desktopId') desktopId: string) {
    return await this._zstackSrv.getVMState(desktopId)
  }

  @ApiOperation({ summary: '获取指定虚拟机的详情' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Get('detail/:desktopId')
  public async getVMDetail(@Param('desktopId') desktopId: string) {
    return await this._zstackSrv.getVMStateDetail(desktopId)
  }

  @ApiOperation({ summary: '开机指定的虚拟机' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Post('boot/:desktopId')
  public async startVM(@Param('desktopId') desktopId: string) {
    return await this._zstackSrv.startVM(desktopId)
  }

  @ApiOperation({ summary: '关机指定的虚拟机' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'id', description: '虚拟机ID' })
  @Post('shutdown/:desktopId')
  public async stopVM(@Param('desktopId') desktopId: string) {
    return await this._zstackSrv.stopVM(desktopId)
  }

  @ApiOperation({ summary: '重启指定的虚拟机' })
  @AllowDesktopOperate()
  @ApiParam({ name: 'desktopId', description: '虚拟机ID' })
  @Post('reboot/:desktopId')
  public async rebootVM(@Param('desktopId') desktopId: string) {
    return await this._zstackSrv.rebootVM(desktopId)
  }
}
