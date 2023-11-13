import { IRole } from './role.interface';
import { ILogin } from './login.interface';
import { IDesktop } from './desktop.interface';
import { IDataRole } from './data-role.interface';
import { IAccountDto } from '../dto/account.interface';
import { IPasswordOptionalDto } from '../dto/password.interface';
import { IDesktopQueue } from './desktop-queue.interface';
import { IEmailOptionalDto } from '../dto/email.interface';
import { IRegisterPlatformDto } from '../dto/register-platform.interface';
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";
import { IVerificationHistory } from './verification.interface';
import { INicknameOptionalDto } from '../dto/nickname.interface';
import { IFileExportSmall } from './export/file-export-small.interface';
import { IFileExportLarge } from './export/file-export-large.interface';
import { IDesktopQueueHistory } from './desktop-queue-history.interface';
import { IWork } from './work.interface';

export interface IUser extends
  ICreatedAt,
  IUpdatedAt,
  IPasswordOptionalDto,
  IAccountDto,
  IEmailOptionalDto,
  IRegisterPlatformDto,
  INicknameOptionalDto {

  /** 用户唯一标识（UUID, v4) */
  id: string

  /** 头像地址 */
  avatar?: string

  /** 账号是否被删除 */
  isDeleted?: boolean

  /** 是否是系统管理员 */
  isSysAdmin: boolean

  /** 用户的角色信息 */
  role?: IRole

  /** 用户的数据下载角色信息 */
  dataRole?: IDataRole

  /** 角色名称（角色信息外键） */
  dataRoleName?: IDataRole['name']

  /** 角色名称（角色信息外键） */
  roleName?: string

  /** 认证信息，只有审核通过后才存在 */
  verification?: IVerificationHistory

  /** 关联的认证信息 id */
  verificationId?: IVerificationHistory['id']

  /** 创建的认证信息 */
  founderVerifications?: IVerificationHistory[]

  /** 处理的认证信息 */
  handlerVerifications?: IVerificationHistory[]

  /** 当前激活的所有的登录信息 */
  logins?: ILogin[]

  /** 当前使用中的云桌面信息 */
  desktop?: IDesktop

  /** 曾使用过的云桌面列表 */
  desktopHistories?: IDesktop[]

  /** 当前排队中的云桌面 */
  desktopQueue?: IDesktopQueue

  /** 已结束的云桌面申请（历史记录） */
  desktopQueueHistory?: IDesktopQueueHistory[]

  /** 外发的小文件列表 */
  exportsSmall?: IFileExportSmall[]

  /** 外发的大文件列表 */
  exportsLarge?: IFileExportLarge[]

  /** 处理过（通过/驳回）的大文件外发列表 */
  exportsLargeHandled?: IFileExportLarge[]

  /** 上传的作品列表 */
  works?: IWork[]
}
