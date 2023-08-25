import { useRequest } from '../../../../admin/src/composables/request'

const { $delete } = useRequest()
/**
 *
 * @param id 上传记录的唯一标识
 */
export function deleteWork(id: string) {
  return $delete(`work/${id}`)
}
