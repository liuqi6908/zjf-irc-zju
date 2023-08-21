import { useRequest } from '../../composables/request'

const { $put, $get, queryParamsUrl } = useRequest()

export function getPublicFileUrl(path: string, filename: string) {
  if (filename && filename.length) {
    const index = filename.lastIndexOf('.')
    const ext = filename.substring(index + 1)

    /** 当图片后缀为svg的时候直接返回svg文本 */
    if (ext === 'svg')
      return $get('file/public', { path: `${path}/${filename}` }, false)

    else
      return queryParamsUrl(`${import.meta.env.VITE_API_BASE}/file/public`, { path: `${path}/${filename}` })
  }
}

export function putPublicFile(path: string, filename: string, file: FormData) {
  return $put('file/public', file, { path: `${path}/${filename}` })
}
