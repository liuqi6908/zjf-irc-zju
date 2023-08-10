import { AUTH_TOKEN_KEY } from 'shared/constants'
import { useRequest } from '../../composables/request'

const { $get } = useRequest()

const tokenStr = localStorage.getItem(AUTH_TOKEN_KEY)

export function getVerifyFileUrl(userId: string, filename: string, token = tokenStr) {
  return `${import.meta.env.VITE_API_BASE}/file/private/verify/${userId}/${filename}?token=${token}`
}

export function getVerifyFile(userId: string, filename: string) {
  const res = $get(`file/private/verify/${userId}/${filename}`, 'response')
  return res
}
