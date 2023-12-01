import { getUrlByToken } from './getUriByToken'

/**
 * 获取下载指定根目录的数据库介绍链接
 * @param dataRootId
 * @param filename 文件名为: DATABASE_ENG + .doc
 */
export function getDataDescribe(dataRootId: string, filename: string) {
  return getUrlByToken(`file/private/db/${dataRootId}/${filename}`)
}
