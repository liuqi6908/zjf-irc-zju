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

export enum UploadType {
  /** 预览 */
  PREVIEW = 'preview',
  /** 下载 */
  DOWNLOAD = 'download',
}

export const dataRootDescriptions: Record<DataRoot, string> = {
  [DataRoot.PURCHASED]: '已购数据资源',
  [DataRoot.SELF_BUILT]: '自建数据库',
  [DataRoot.PUBLIC]: '公共数据资源',
  [DataRoot.PRE_PURCHASED]: '预购数据资源',
}

export const uploadTypeDescriptions: Record<UploadType, string> = {
  [UploadType.PREVIEW]: '预览',
  [UploadType.DOWNLOAD]: '下载',
}

export const allDataRoots = objectKeys(dataRootDescriptions)