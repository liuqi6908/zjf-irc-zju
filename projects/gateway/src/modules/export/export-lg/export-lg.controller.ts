import { ApiTags } from '@nestjs/swagger'
import { Controller } from '@nestjs/common'

@ApiTags('ExportLg | 大文件外发')
@Controller('export-lg')
export class ExportLgController {}
