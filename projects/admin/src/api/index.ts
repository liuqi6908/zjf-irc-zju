import axios from 'axios'
import { Notify } from 'quasar'
import { AUTH_TOKEN_KEY } from 'shared/constants'
import { ErrorCode } from 'zjf-types'
import { ctx } from '../modules/ctx'

// import router from '@/router/index'

const $http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  // headers: { 'Access-Control-Allow-Origin': '*' },
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
      showNotify('没有权限')
      ctx.router?.replace({ path: 'denied' })
    }

    if (error.response.status === 401) {
      showNotify('登录过期，请重新登录')
      ctx.router?.replace({ path: 'auth/login' })
      localStorage.removeItem(AUTH_TOKEN_KEY)
      return Promise.reject(error)
    }

    if (Array.isArray(errorDetailList) && errorDetailList) {
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

/**
 * 显示跳转登录
 * @returns
 */
// function showRedirectLoginBox() {
//   Dialog.create({
//     title: '是否前往登录',
//     message: '此操作需要登录后使用，是否立即前往登录',
//     cancel: '暂不登录',
//     ok: '立即前往登录',
//     class: 'style-1',
//   })
//     .onOk(() => {
//       ctx.router?.push({
//         name: 'Login',
//         query: {
//           redirect: ctx.router?.currentRoute?.value?.fullPath,
//         },
//       })
//     })
//     .onCancel(() => {})
// }

export default $http
