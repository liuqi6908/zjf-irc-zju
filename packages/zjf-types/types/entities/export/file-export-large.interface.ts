import { IUser } from "../user.interface";
import { IFileExportBasic } from "./file-export-basic.interface";

export enum FileExportLargeStatus {
  /** 待处理 */
  Pending = 'pending',
  /** 已通过 */
  Approved = 'approved',
  /** 已拒绝 */
  Rejected = 'rejected',
}

export interface IFileExportLarge extends IFileExportBasic {
  /** 处理者 */
  handler: IUser;
  /** 处理者的唯一标识 */
  handlerId: string;
  /** 处理时间 */
  handleAt: Date;
  /** 在 minio 中保存的完整路径 */
  path: string;
  /** 状态 */
  status: FileExportLargeStatus;
  /** 驳回原因 */
  rejectReason?: string;
}