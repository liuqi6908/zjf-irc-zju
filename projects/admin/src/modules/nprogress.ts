import NProgress from 'nprogress'
import { AUTH_TOKEN_KEY } from 'shared/constants'
import { type UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from) => {
      const isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY)
      // if (to.path !== from.path)
      //   NProgress.start()
      const authPath = !(to.name)?.toString()?.includes('auth')
      if (!isAuthenticated && authPath)
        return { name: 'auth-login' }
    })
    router.afterEach(() => {
      NProgress.done()
    })
  }
}
