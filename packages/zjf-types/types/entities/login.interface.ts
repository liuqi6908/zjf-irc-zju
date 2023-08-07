import { ICreatedAt } from "./_timestamp.interface";
import { IUser } from "./user.interface";

export interface ILogin extends ICreatedAt {
  /** 唯一标识，通过 md5(token) 得到 */
  id: string;
  
  /** 登录凭证 */
  token: string

  /** 过期时间 */
  expireAt: Date

  /** 用户信息 */
  user: IUser;
  
  /** 用户唯一标识 */
  userId: IUser['id']

  /** 登录的 ip */
  ip?: string;

  /** 最后活动时间 */
  lastActiveAt?: Date;
}