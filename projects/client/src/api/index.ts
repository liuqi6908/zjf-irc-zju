import axios from 'axios'
import { Notify } from 'quasar'

const $http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

$http.interceptors.request.use((config) => {
  // if (token && !config.headers.Authorization)
  //   config.headers.Authorization = `Bearer ${token.value}`
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
    // if (
    //   [
    //     ErrorCode.LOGIN_EXPIRED,
    //     ErrorCode.LOGIN_REQUIRED,
    //     ErrorCode.PERMISSION_DENIED,
    //     ErrorCode.TOKEN_FAILED,
    //     ErrorCode.TOKEN_INVALID,
    //   ].includes(response.data.status)
    // ) {
    //   showRedirectLoginBox()
    //   const newResponse = {
    //     ...response,
    //     data: { ...response.data, status: 0 },
    //   }
    //   return newResponse
    // }

    return response.data
  },
  (error) => {
    const errorDetailList = error.response.data.detail
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
