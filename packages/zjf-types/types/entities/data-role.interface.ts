import { IDataDirectory } from "./data-directory.interface"
import { IUser } from "./user.interface"

/**
 * 数据下载角色信息（区分于 IRole，仅针对数据下载，IRole 为业务角色）
 */
export interface IDataRole {

  /** 角色名称（作为唯一标识） */
  name: string

  /** 角色描述 */
  description?: string

  /** 是否可选 */
  select?: boolean

  /** 排序 */
  sort?: number

  /** 拥有该角色的用户列表 */
  users?: IUser[]

  /** 可访问的数据目录列表 */
  directories?: IDataDirectory[]
}