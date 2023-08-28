import { IUser } from "../user.interface";
import { IDesktop } from "../desktop.interface";
import { ICreatedAt } from "../_timestamp.interface";

export interface IFileExportBasic extends ICreatedAt {
  /** 外发记录的唯一标识 */
  id: string;

  /** 创建外发的 ip 地址 */
  ip: string;

  /** 
   * 发起外发的云桌面信息 
   * 该字段通过 `leftJoinAndMapOne` 关联查询
   **/
  desktop?: IDesktop;

  /** 创建者 */
  founder: IUser;
  /** 创建者的唯一标识 */
  founderId: string;

  /** 文件名 */
  fileName: string;
  /** 文件大小，单位为字节 */
  fileSize: number;
  /** 备注信息 */
  note?: string;

  /** 邮箱地址 */
  email?: string;

  /** 在 minio 中保存的完整路径 */
  path: string;
}