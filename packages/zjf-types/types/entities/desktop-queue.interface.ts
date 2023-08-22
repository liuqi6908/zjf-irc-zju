import { IUser } from "./user.interface";
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";

export enum DesktopQueueStatus {
  // 待审核
  Pending = 'pending',
  // 排队中
  Queueing = 'queueing',
  // 使用中
  Using = 'using',
}

export interface IDesktopQueue extends ICreatedAt, IUpdatedAt {
  /** 
   * @description 用户id，作为排队队列的唯一标识，一个用户同时只能有一个 申请中｜排队中｜正在使用， 同时作为外键，关联到用户表
   **/
  userId: IUser['id'];

  /** 关联的用户信息 */
  user: IUser;

  /** 发起申请的时间 */
  requestAt: Date;

  /** 开始排队的时间 */
  queueAt?: Date;

  /** 申请的时长，单位为天 */
  duration: number;

  /** 队列状态 */
  status: DesktopQueueStatus;

  /** 申请材料列表 */
  attachments: string[];
}