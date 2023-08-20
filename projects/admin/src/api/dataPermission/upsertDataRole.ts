import { useRequest } from '../../composables/request'

const { $post } = useRequest()

export function upsertDataRole(name: string, viewableDirectoryIds: string[], downloadableDirectoryIds: string[], description?: string) {
  return $post('data-permission/data-role/upsert', { name, viewableDirectoryIds, downloadableDirectoryIds, description })
}
