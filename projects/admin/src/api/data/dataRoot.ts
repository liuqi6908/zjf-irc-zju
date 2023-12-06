import type { ICreateRootBodyDto, IDataDirectory } from 'zjf-types'

const { $delete, $put, $patch } = useRequest()

/**
 * 创建一个数据大类
 * @param body
 * @returns
 */
export function createDataRoot(body: ICreateRootBodyDto) {
  return $put<IDataDirectory>('/data/root', body)
}

/**
 * 删除指定的数据大类
 * @param id
 * @returns
 */
export function deleteDataRoot(id: string) {
  return $delete<number>(`/data/root/${id}`)
}

/**
 * 更新一个数据大类
 * @param body
 * @returns
 */
export function updateDataRoot(body: ICreateRootBodyDto) {
  return $patch<number>(`/data/root/${body.id}`, body)
}

/**
 * 上传中间表
 * @param id
 * @param file
 * @param clear
 * @returns
 */
export function uploadDataByRootId(id: string, file: FormData, clear = true) {
  return $put(`/data/upload/${id}`, file, { clear })
}
