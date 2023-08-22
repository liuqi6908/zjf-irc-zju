import { AUTH_TOKEN_KEY } from 'shared/constants'
import { type UserModule } from '~/types'
import { useUser } from '~/composables/useUser'

const { isRoot, userInfo } = useUser()
let isAuthenticated: any = null
if (typeof window !== 'undefined') {
  // Perform localStorage action
  isAuthenticated = localStorage.getItem(AUTH_TOKEN_KEY) || null
}

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach((to, from) => {
      // if (to.path !== from.path)
      //   NProgress.start()

      const authPath = !(to.name)?.toString()?.includes('auth')

      if (!isAuthenticated && authPath)
        return { name: 'auth-login' }
    })
    // router.afterEach(() => {
    //   NProgress.done()
    // })
  }
}
