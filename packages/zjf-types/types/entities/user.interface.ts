import { IAccountDto } from '../dto/account.interface';
import { IPasswordDto } from '../dto/password.interface';
import { IEmailOptionalDto } from '../dto/email.interface';
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";
import { INicknameOptionalDto } from '../dto/nickname.interface';

export interface IUser extends 
  ICreatedAt, 
  IUpdatedAt, 
  IPasswordDto, 
  IAccountDto,
  IEmailOptionalDto,
  INicknameOptionalDto {

  /** 用户唯一标识（UUID, v4) */
  id: string;

  /** 头像地址 */
  avatar?: string;

  /** 账号是否被删除 */
  isDeleted?: boolean;
}
