import { IBasicResponse } from "../basic.interface";
import { IDataField } from "../../entities/data-field.interface";

export interface IGetDataFieldListResDto extends IBasicResponse<IDataField[]> {}