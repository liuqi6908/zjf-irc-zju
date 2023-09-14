import type { ICreateDesktopBodyDto, IDesktop, IPaginatedResData, IQueryConfig, IUpdateDesktopInterface } from 'zjf-types'

const { $delete, $patch, $post, $put } = useRequest()

/**
 * 查询云桌面列表
 * @param body
 */
export function desktopQueryList(body: IQueryConfig<IDesktop>) {
  return $post<IPaginatedResData<IDesktop>>('desktop/query', body)
}

/**
 * 新建云桌面
 * @param body
 */
export function createDesktop(body: ICreateDesktopBodyDto) {
  return $put('desktop', body)
}

/**
 * 更新云桌面
 * @param id
 * @param body
 */
export function updateDesktop(id: string, body: IUpdateDesktopInterface) {
  return $patch(`desktop/${id}`, body)
}

/**
 * 停用云桌面
 * @param id
 */
export function stopDesktop(id: string) {
  return $delete(`desktop/${id}`)
}

/**
 * 分配云桌面
 * @param id
 * @param userId
 */
export function assignDesktop(id: string, userId: string) {
  return $patch(`desktop/${id}/assign/${userId}`)
}

/**
 * 上传文件批量创建云桌面
 * @param file
 */
export function uploadFileCreateDesktop(file: FormData) {
  return $put('desktop/upload', file)
}
