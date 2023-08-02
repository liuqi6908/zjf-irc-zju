import { useStorage } from '@vueuse/core'
import { encryptPasswordInHttp } from 'zjf-utils'
import { login } from '~/api/auth/login'
import { register } from '~/api/auth/register'

const authToken = useStorage('auth_token', '')

export function useUser($router = useRouter()) {
  /** 登录 */
  const useLogin = async (password: string, account?: string, email?: string) => {
    /** 加密 */
    password = encryptPasswordInHttp(password)
    const res = await login(password, account, email)
    if (res)
      authToken.value = res.sign.access_token

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
      await useLogin(password, account, email)
  }

  return {
    useRegister,
    useLogin,
  }
}
