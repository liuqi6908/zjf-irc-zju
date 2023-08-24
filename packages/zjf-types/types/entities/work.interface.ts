import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";
import { IUser } from "./user.interface";

/** 用户成果（作品） */
export interface IWork extends ICreatedAt, IUpdatedAt {

  /** 唯一标识 */
  id: string;

  /** 文件名（唯一） */
  filename: string;

  /** 上传的用户 */
  user: IUser;

  /** 用户 */
  userId: IUser['id'];

  /** 题目 */
  title: string;

  /** 作者 */
  author: string;

}