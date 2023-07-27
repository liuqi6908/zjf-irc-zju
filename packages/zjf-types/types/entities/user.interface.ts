import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";

export interface IUser extends ICreatedAt, IUpdatedAt {
  /** 用户唯一标识（UUID, v4) */
  id: string;

  /** 手机号 */
  phone: string;

  /** 邮箱 */
  email?: string;

  /** 加密后的密码 */
  password: string;

  /** 用户昵称 */
  nickname?: string;

  /** 头像地址 */
  avatar?: string;

  /** 账号是否被删除 */
  isDeleted?: boolean;
}
