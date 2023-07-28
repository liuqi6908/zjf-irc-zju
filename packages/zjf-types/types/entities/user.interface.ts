import { IPhoneDto } from '../dto/phone.interface';
import { IPasswordDto } from '../dto/password.interface';
import { IEmailOptionalDto } from '../dto/email.interface';
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";

export interface IUser extends 
  ICreatedAt, 
  IUpdatedAt, 
  IPasswordDto, 
  IPhoneDto, 
  IEmailOptionalDto {
  /** 用户唯一标识（UUID, v4) */
  id: string;

  /** 用户昵称 */
  nickname?: string;

  /** 头像地址 */
  avatar?: string;

  /** 账号是否被删除 */
  isDeleted?: boolean;
}
