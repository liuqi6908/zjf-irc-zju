import type { ISysConfig, IUpsertConfigBodyDto } from 'zjf-types'

const { $get, $post } = useRequest()

/**
 * 获取指定全局配置
 * @param version
 * @returns
 */
export function getConfig(version: string) {
  return $get<ISysConfig>(`/config/${version}`)
}

/**
 * 创建/更新全局配置
 * @param body
 * @returns
 */
export function upsertConfig(body: IUpsertConfigBodyDto) {
  return $post('config', body)
}
