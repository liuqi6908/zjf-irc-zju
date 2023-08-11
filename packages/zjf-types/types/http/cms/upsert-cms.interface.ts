import { ICms } from "../../entities/cms.interface";
import { IBasicResponse } from "../basic.interface";

export interface IUpsertCmsBodyDto<T> extends Pick<ICms<T>, 'json'> {}
export interface ICmsResponseDto<T> extends IBasicResponse<ICms<T>> {}