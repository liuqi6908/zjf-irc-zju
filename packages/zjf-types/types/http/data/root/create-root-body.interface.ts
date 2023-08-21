import { IDataDirectory } from "../../../entities/data-directory.interface";

export interface ICreateRootBodyDto extends Pick<IDataDirectory, 'nameZH'> {
}