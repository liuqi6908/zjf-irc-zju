import { IUser } from "../user.interface";
import { IFileExportBasic } from "./_file-export-basic.interface";

export interface IFileExportBig extends IFileExportBasic {
  /** 处理者 */
  handler: IUser;
  /** 处理者的唯一标识 */
  handlerId: string;
  /** 处理时间 */
  handleAt: Date;
}