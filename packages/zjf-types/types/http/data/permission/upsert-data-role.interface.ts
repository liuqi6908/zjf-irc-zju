export interface IUpsertDataRoleBodyDto {
  /** 数据角色名称 */
  name: string

  /** 数据角色描述 */
  description?: string

  /** 是否可选 */
  select?: boolean

  /** 排序 */
  sort?: number

  /** 数据角色可查看的目录id列表 **需要传入全部的** */
  viewableDirectoryIds?: string[]

  /** 数据角色可下载的目录id列表 **需要传入全部的** */
  downloadableDirectoryIds?: string[]
}