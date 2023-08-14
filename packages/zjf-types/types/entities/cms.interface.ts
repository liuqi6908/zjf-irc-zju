import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface";

export interface ICms<T> extends IUpdatedAt, ICreatedAt {
  /** 内容的唯一标识 */
  id: string;

  /** 内容配置 */
  json?: T

  /** 最后一次修改的用户的 id */
  lastUpdatedBy: string
}