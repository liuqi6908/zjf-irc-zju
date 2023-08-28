import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('DesktopControl | 云桌面控制/管理')
@Controller('desktop-control')
export class DesktopControlController {
  @ApiOperation({ summary: '获取虚拟机状态' })
  @Get('state')
  public async getVMState() {

  }
}
