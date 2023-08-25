import { useRequest } from '../../composables/request'

const { $put, $get, queryParamsUrl, $getUri } = useRequest()

export function getPublicFileUrl(path: string, filename: string) {
  if (filename && filename.length) {
    const index = filename.lastIndexOf('.')
    const ext = filename.substring(index + 1)

    /** 当图片后缀为svg的时候直接返回svg文本 */
    if (ext === 'svg') {
      return $get('file/public', { path: `${path}/${filename}` }, false)
    }

    else {
      const url = queryParamsUrl('file/public', { path: `${path}/${filename}` })
      return $getUri(url)
    }
  }
}

export function putPublicFile(path: string, filename: string, file: FormData) {
  return $put('file/public', file, { path: `${path}/${filename}` })
}
