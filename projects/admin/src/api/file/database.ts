import $http from 'axios'
import type { UploadType } from 'zjf-types'

const { $put, $post } = useRequest()
const { authToken } = useUser()

/**
 * 获取数据库介绍文件的url
 * @param id
 * @param nameEn
 */
export function getIntroduceUrl(id: string, nameEn: string) {
  return `/api/file/private/db/${id}/${nameEn}.docx?token=${authToken.value}`
}

/**
 * 获取数据库介绍文件
 * @param id
 * @param nameEn
 * @returns
 */
export function getIntroduceFile(id: string, nameEn: string) {
  return $http.get(getIntroduceUrl(id, nameEn))
}

/**
 * 上传数据库介绍文件
 * @param id
 * @param nameEn
 * @param file
 * @returns
 */
export function uploadIntroduceFile(id: string, nameEn: string, file: FormData) {
  return $put(`/file/private/db/${id}/${nameEn}.docx`, file)
}

/**
 * 表格文件是否存在
 * @param rootId
 * @param dataDirectorId
 * @returns
 */
export function tableFileIsExist(uploadType: UploadType, rootId: string, tableEn: string) {
  return $post<boolean>('/file/isExist', {
    bucket: 'data',
    path: `/${uploadType}/${rootId}/${tableEn}.${uploadType === 'download' ? 'zip' : 'csv'}`,
  })
}
