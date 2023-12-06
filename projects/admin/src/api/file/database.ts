import $http from 'axios'

const { $put } = useRequest()
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
