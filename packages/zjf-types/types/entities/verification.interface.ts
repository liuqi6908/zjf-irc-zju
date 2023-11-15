import { IUser } from './user.interface';
import { VerificationIdentify, VerificationStatus } from '../verification.enum';
import { ICreatedAt, IUpdatedAt } from './_timestamp.interface';


export interface IVerificationHistory extends ICreatedAt, IUpdatedAt {
  /** 认证记录的唯一标识 */
  id: string;

  // 基础信息
  /** 真实姓名 */
  name: string;

  /** 学校名称 */
  school: string;

  /** 学院名称 */
  college: string;

  /** 学号或工号 */
  number: string;

  /** 身份证号码 */
  idCard: string;

  /** 身份 */
  identify: VerificationIdentify;

  /** 上传的附件列表，oss 相对地址列表  */
  attachments: string[];


  // 与用户的关联
  /** 创建者 */
  founder: IUser;

  /** 创建者的 id */
  founderId: IUser['id'];

  /** 处理者 */
  handler?: IUser;

  /** 处理者的 id */
  handlerId?: IUser['id'];

  /** 当前激活的用户 */
  user?: IUser;

  /** 当前激活的用户 id */
  userId?: IUser['id'];

  /** 处理时间： 通过/驳回/取消 */
  handledAt?: Date;
  
  /** 认证状态 */
  status: VerificationStatus;

  /** 驳回原因（仅当状态为驳回时存在）*/
  rejectReason?: string;
}