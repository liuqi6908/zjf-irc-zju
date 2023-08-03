import { useStorage } from '@vueuse/core'
import type { IUser } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { getProfile } from '~/api/auth/getProfile'
import { login } from '~/api/auth/login'
import { logout } from '~/api/auth/logout'
import { register } from '~/api/auth/register'

const authToken = useStorage('auth_token', '')
const userInfo = ref<IUser>()

export function useUser($router = useRouter()) {
  /** 登录 */
  const useLogin = async (options: { password: string; account?: string; email?: string }) => {
    /** 加密 */
    options.password = encryptPasswordInHttp(options.password)
    const res = await login(options)
    if (res) {
      authToken.value = res.sign.access_token
      userInfo.value = res.user
    }

    $router.replace({ path: '/home' })
  }

  /** 注册 */
  const useRegister = async (
    account: string,
    email: string,
    password: string,
    bizId: string,
    code: string,
  ) => {
    password = encryptPasswordInHttp(password)
    const res = await register(account, email, password, bizId, code)
    if (res)
      await useLogin({ password, account, email })
  }

  const useLogout = async () => {
    const res = await logout()
    if (!res)
      return
    authToken.value = null
    $router.replace({ path: '/login' })
  }

  const useGetProfile = async (relation?: string) => {
    const res = await getProfile(relation)
    if (res)

      userInfo.value = res
  }

  return {
    useRegister,
    useLogin,
    useLogout,
    userInfo,
    authToken,
    useGetProfile,
  }
}
