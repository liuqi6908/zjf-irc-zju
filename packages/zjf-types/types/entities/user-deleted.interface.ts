import { IAccountDto } from "../dto/account.interface";
import { IEmailOptionalDto } from "../dto/email.interface";
import { ICreatedAt } from "./_timestamp.interface";
import { IUser } from "./user.interface";

export interface IUserDeleted extends 
  ICreatedAt, 
  IAccountDto, 
  IEmailOptionalDto {
  /** 自动生成的 uuid v4 */
  id: string;

  /** 用户唯一标识 */
  userId: string;

  /** 删除的用户记录关联 */
  user?: IUser;
}