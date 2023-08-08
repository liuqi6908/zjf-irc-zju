import { IFilenameDto } from "../../dto/filename.interface";
import { IUserIdDto } from "../../dto/user-id.interface";

export interface IGetVerifyAttachmentParamDto extends IUserIdDto, IFilenameDto {}