import { ICreatedAt } from "./_timestamp.interface";
import { IUser } from "./user.interface";

export interface IUserDeleted extends ICreatedAt {

  /** 自动生成的 uuid v4 */
  id: string;

  /** 用户唯一标识 */
  userId: string;

  /** 删除的用户记录关联 */
  user?: IUser;

  /** 删除时的手机号 */
  phoneNumber: string;

  /** 删除时的邮箱 */
  email?: string;
}