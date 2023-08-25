import { useRequest } from '../../../../admin/src/composables/request'

const { $put } = useRequest()

export function createWork(file: File, title: string, author: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', title)
  formData.append('author', author)

  return $put('work', formData)
}
