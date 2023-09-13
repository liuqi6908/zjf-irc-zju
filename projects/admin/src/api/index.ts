import axios from 'axios'
import { Notify } from 'quasar'
import { AUTH_TOKEN_KEY } from 'shared/constants'
import { ErrorCode } from 'zjf-types'
import { ctx } from '../modules/ctx'

const $http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

$http.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token && !config.headers.Authorization)
    config.headers.Authorization = token ? `Bearer ${token?.trim()}` : ''

  const baseURLWhiteList = ['http', '//']
  if (
    config.url
    && baseURLWhiteList.some(prefix => config.url?.startsWith(prefix))
  )
    config.baseURL = ''

  if (config.url?.startsWith('_/') || config.url?.startsWith('/_/')) {
    config.url = config.url.slice(2)
    config.baseURL = ''
  }
  return config
})

$http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (!error.response)
      return
    const errorDetailList = error.response.data.detail

    /** 判断是否有权限 */
    if (error.response.data.status === ErrorCode.PERMISSION_DENIED) {
      showNotify('没有权限执行此操作')
      ctx.router?.replace({ path: 'denied' })
    }
    /* 判断登录是否未登录 */
    else if (error.response.data.status === ErrorCode.AUTH_LOGIN_REQUIRED) {
      showNotify('请登录后重试')
      ctx.router?.replace({ path: 'auth/login' })
    }
    /* 判断登录是否过期 */
    else if (error.response.data.status === ErrorCode.AUTH_LOGIN_EXPIRED) {
      showNotify('登录过期，请重新登录')
      ctx.router?.replace({ path: 'auth/login' })
      localStorage.removeItem(AUTH_TOKEN_KEY)
    }
    else if (Array.isArray(errorDetailList)) {
      errorDetailList.forEach(detail =>
        showNotify(detail.message),
      )
    }
    else {
      showNotify(error.response.data.message)
    }

    return Promise.reject(error)
  },
)

function showNotify(massage: string) {
  Notify.create({
    type: 'danger',
    message: massage,
  })
}

export default $http
