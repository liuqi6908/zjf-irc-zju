import { useRequest } from '../../composables/request'

const { $put, queryParamsUrl } = useRequest()

export function getPublicFileUrl(path: string, filename: string) {
  const queryUrl = queryParamsUrl(`${import.meta.env.VITE_API_BASE}/file/public`, { path: `${path}/${filename}` })
  return `${queryUrl}`
}

export function putPublicFile(path: string, filename: string, file: FormData) {
  return $put('file/public', file, { path: `${path}/${filename}` })
}
