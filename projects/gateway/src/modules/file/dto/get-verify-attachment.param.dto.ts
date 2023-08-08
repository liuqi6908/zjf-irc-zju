import { FilenameDto } from 'src/dto/filename.dto'
import { UserIdDto } from 'src/dto/user-id.dto'
import { Mixin } from 'ts-mixer'

export class GetVerifyAttachmentParamDto
  extends Mixin(UserIdDto, FilenameDto) {}
