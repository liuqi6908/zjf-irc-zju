import { Controller } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DesktopService } from './desktop.service'

@ApiTags('Desktop | 云桌面')
@Controller('desktop')
export class DesktopController {
  constructor(
    private readonly _desktopSrv: DesktopService,
  ) {}
}
