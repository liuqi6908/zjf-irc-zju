import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function upsertCms<T>(cmsId: string, json: T) {
  return $post(`/cms/upsert/${cmsId}`, { json })
}
