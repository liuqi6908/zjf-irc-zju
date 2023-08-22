import { IUser } from './user.interface';
import { ICreatedAt, IUpdatedAt } from './_timestamp.interface';


export enum DesktopQueueHistoryStatus {
  // 驳回
  Rejected = 'rejected',
  // 过期
  Expired = 'expired',
  // 取消
  Canceled = 'canceled',
}

/** 
 * 云桌面申请队列的历史记录 
 * 当云桌面到期后，该用户的申请记录会被转移到该表中
 **/
export interface IDesktopQueueHistory extends ICreatedAt, IUpdatedAt {

  /** 历史记录的唯一标识，UUID 自动生成 */
  id: string;
  
  /** 
   * @description 作为外键，关联到用户表
   */
  userId: IUser['id'];

  /** 关联的用户信息 */
  user: IUser;

  /** 发起申请的时间 */
  requestAt: Date;

  /** 开始排队的时间 */
  queueAt?: Date;

  /** 申请的时长，单位为天 */
  duration: number;

  /** 申请材料列表 */
  attachments: string[];

  /** 状态 */
  status: DesktopQueueHistoryStatus;

  /** 驳回原因 */
  rejectReason?: string;
}