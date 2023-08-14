import { IBasicResponse } from "../basic.interface";
import { IDataDirectory } from "../../entities/data-directory.interface";

export interface IGetDataListResponse extends IBasicResponse<IDataDirectory[]> {}