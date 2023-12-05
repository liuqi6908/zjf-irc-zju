import axios from 'axios'
import { Notify } from 'quasar'
import { ErrorCode } from 'zjf-types'

const $http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

$http.interceptors.request.use((config) => {
  if (authToken.value && !config.headers.Authorization)
    config.headers.Authorization = `Bearer ${authToken.value.trim()}`

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

    if (error.config.headers.message === false)
      return Promise.reject(error)

    const { status, detail, message } = error.response.data

    /** 判断登录是否过期 */
    if (error.response.status === 401 || status === ErrorCode.AUTH_LOGIN_EXPIRED) {
      authToken.value = null
      userInfo.value = undefined
    }
    else if (Array.isArray(detail)) {
      detail.forEach(item =>
        showNotify(item.message),
      )
    }
    else {
      showNotify(message)
    }

    return Promise.reject(error)
  },
)

function showNotify(message: string) {
  if (message) {
    Notify.create({
      type: 'danger',
      message,
    })
  }
}

export default $http
