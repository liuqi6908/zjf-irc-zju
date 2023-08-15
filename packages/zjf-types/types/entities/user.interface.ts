import { IRole } from './role.interface';
import { ILogin } from './login.interface';
import { IAccountDto } from '../dto/account.interface';
import { IPasswordDto } from '../dto/password.interface';
import { IEmailOptionalDto } from '../dto/email.interface';
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";
import { IVerificationHistory } from './verification.interface';
import { INicknameOptionalDto } from '../dto/nickname.interface';
import { IDataRole } from './data-role.interface';

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

  /** 是否是系统管理员 */
  isSysAdmin: boolean;

  /** 用户的角色信息 */
  role?: IRole;

  /** 用户的数据下载角色信息 */
  dataRole?: IDataRole;

  /** 角色名称（角色信息外键） */
  dataRoleName?: IDataRole['name']

  /** 角色名称（角色信息外键） */
  roleName?: string;

  /** 认证信息，只有审核通过后才存在 */
  verification?: IVerificationHistory;

  /** 关联的认证信息 id */
  verificationId?: IVerificationHistory['id'];

  /** 创建的认证信息 */
  founderVerifications?: IVerificationHistory[];

  /** 处理的认证信息 */
  handlerVerifications?: IVerificationHistory[];

  /** 当前激活的所有的登录信息 */
  logins?: ILogin[]
}
