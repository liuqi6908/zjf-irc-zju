import { Mixin } from 'ts-mixer'
import { FilenameDto } from 'src/dto/filename.dto'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import { UploadTypeDto } from 'src/dto/upload-type.dto'
import type { IUploadTableDataParamDto } from 'zjf-types'

export class UploadTableDataParamDto
  extends Mixin(FilenameDto, DataRootIdDto, UploadTypeDto)
  implements IUploadTableDataParamDto {}
