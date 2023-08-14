import { Mixin } from 'ts-mixer'
import { FilenameDto } from 'src/dto/filename.dto'
import { DataRootIdDto } from 'src/dto/id/data-root.dto'
import type { IUploadDataIntroParamDto } from 'zjf-types'

export class UploadDataIntroParamDto
  extends Mixin(FilenameDto, DataRootIdDto)
  implements IUploadDataIntroParamDto {}
