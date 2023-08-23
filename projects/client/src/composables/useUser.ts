import { useStorage } from '@vueuse/core'
import type { IUser, IVerificationHistory } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { AUTH_TOKEN_KEY } from 'shared/constants'
import { getProfile } from '~/api/auth/getProfile'
import { login } from '~/api/auth/login'
import { logout } from '~/api/auth/logout'
import { register } from '~/api/auth/register'

const authToken = useStorage(AUTH_TOKEN_KEY, '')
const userInfo = ref<IUser>()
const latestVerifiy = ref<IVerificationHistory>()

const { $get } = useRequest()

// const quey: IQueryDto<IVerificationHistory> = {
//   relations: {
//     user: true,
//   },
// }

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
    $router.replace({ path: '/auth/login' })
  }

  /** 默认查询当前用户的认证信息 */
  const useGetProfile = async (relation = 'role.permissions,verification') => {
    const res = await getProfile(relation)
    if (res)
      userInfo.value = res
  }

  const getVerify = async () => {
    latestVerifiy.value = await $get<IVerificationHistory>('/verification/latest')
    return latestVerifiy.value
  }

  return {
    useRegister,
    useLogin,
    useLogout,
    userInfo,
    authToken,
    useGetProfile,
    getVerify,
    latestVerifiy,
  }
}
