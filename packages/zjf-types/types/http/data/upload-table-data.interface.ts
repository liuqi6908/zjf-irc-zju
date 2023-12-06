import { IFilenameDto } from "../../dto/filename.interface";
import { IDataRootIdDto } from "../../dto/id/data-root.interface";
import { IUploadTypeDto } from "../../dto/upload-type.interface";

export interface IUploadTableDataParamDto extends IUploadTypeDto, IFilenameDto, IDataRootIdDto {}