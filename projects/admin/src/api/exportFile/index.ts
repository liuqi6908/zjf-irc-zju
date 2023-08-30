import type { IFileExportLarge, IFileExportSmall, IQueryConfig } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $get, $post } = useRequest()

/**
 * 查询全部大文件外发记录
 * @param options
 */
export function queryExportLg(options: IQueryConfig<IFileExportLarge>) {
  return $post('/export-lg/query', options)
}

/**
 * 查询全部小文件外发记录
 * @param options
 */
export function queryExportSm(options: IQueryConfig<IFileExportSmall>) {
  return $post('/export-sm/query', options)
}

/**
 * 通过大文件外发申请
 * @param id 大文件外发记录的唯一标识
 */
export function approveApply(id: string) {
  return $post(`/export-lg/approve/${id}`)
}

/**
 * 驳回大文件外发申请
 * @param id 大文件外发记录的唯一标识
 * @param reason 驳回原因
 */
export function rejectApply(id: string, reason: string) {
  return $post(`/export-lg/reject/${id}`, { reason })
}

/**
 * 下载大文件外发的附件
 * @param id 大文件外发记录的唯一标识
 */
export function downloadLg(id: string) {
  return $get(`/export-lg/file/${id}`, null, false, { responseType: 'blob' })
}

/**
 * 下载小文件外发的附件
 * @param id 大文件外发记录的唯一标识
 */
export function downloadSm(id: string) {
  return $get(`/export-sm/file/${id}`, null, false, { responseType: 'blob' })
}
