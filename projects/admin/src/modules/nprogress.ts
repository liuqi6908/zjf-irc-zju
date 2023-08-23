import { ADMIN_ROLE_NAME, AUTH_TOKEN_KEY } from 'shared/constants'
import NProgress from 'nprogress'
import { type UserModule } from '~/types'

let isAuthenticated: any = null
let isAdmin: any = null

if (typeof window !== 'undefined') {
  // Perform localStorage action
  isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY) || null
  isAdmin = localStorage.getItem(ADMIN_ROLE_NAME)
}

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from, next) => {
      if (to.path !== from.path)
        NProgress.start()

      // const authPath = !(to.name)?.toString()?.includes('auth')

      // if (!isAuthenticated && authPath)
      //   return { name: 'auth-login' }

      if (to.path === '/auth/login') {
        next()
      }
      else if (from.path === '/auth/login') {
        if (to.path.includes('auth')) {
          next()
        }
        else {
          // TODO:鉴权
          // if (!isAdmin || isAdmin !== 'root') {
          //   if (to.path === 'home')
          //     next('/denied')
          // }
          // else {

          next()
          // }
        }
      }
      else {
        next()
      }
    })
    router.afterEach(() => {
      NProgress.done()
    })
  }
}
