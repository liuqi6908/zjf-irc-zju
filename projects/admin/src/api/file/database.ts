import $http from 'axios'

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
 * 获取指定文件夹下的文件列表
 */
export function getFolderFiles(body: {
  bucket: 'data' | 'pri' | 'pub'
  path: string
}) {
  return $post<{
    name: string
  }[]>('/file/folderFiles', body)
}
