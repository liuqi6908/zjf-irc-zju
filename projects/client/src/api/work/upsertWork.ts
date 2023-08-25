import { useRequest } from '../../../../admin/src/composables/request'

const { $patch } = useRequest()

export function upsertWork(id: string, file: File, title: string, author: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  formData.append('author', author)

  return $patch(`work/${id}`, formData)
}
