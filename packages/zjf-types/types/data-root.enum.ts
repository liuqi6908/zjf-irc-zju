import { objectKeys } from "@catsjuice/utils"

export enum DataRoot {
  /** 已购数据资源 */
  PURCHASED = 'purchased',
  /** 自建数据库 */
  SELF_BUILT = 'self-built',
  /** 公共数据资源 */
  PUBLIC = 'public',
  /** 预购数据资源 */
  PRE_PURCHASED = 'pre-purchased',
}

export const dataRootDescriptions: Record<DataRoot, string> = {
  [DataRoot.PURCHASED]: '已购数据资源',
  [DataRoot.SELF_BUILT]: '自建数据库',
  [DataRoot.PUBLIC]: '公共数据资源',
  [DataRoot.PRE_PURCHASED]: '预购数据资源',
}

export const allDataRoots = objectKeys(dataRootDescriptions)