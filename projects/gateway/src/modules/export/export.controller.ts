import { Controller, Put } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ApiFormData } from 'src/decorators/api/api-form-data'

@ApiTags('Export | 文件外发')
@Controller('export')
export class ExportController {
  constructor() {}

  @ApiOperation({ summary: '小文件外发' })
  @ApiFormData()
  @Put('small')
  public async exportSmall() {

  }
}
