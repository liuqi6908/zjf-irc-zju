import { useRequest } from '../../composables/request'
import { getUrlByToken } from './getUrl'

const { $get } = useRequest()

export function getVerifyFileUrl(userId: string, filename: string) {
  return getUrlByToken(`file/private/verify/${userId}/${filename}`)
}

export function getVerifyFile(userId: string, filename: string) {
  const res = $get(`file/private/verify/${userId}/${filename}`)
  return res
}
