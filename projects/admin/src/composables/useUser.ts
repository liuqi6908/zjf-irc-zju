import { useStorage } from '@vueuse/core'
import type { IUser } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { ADMIN_ROLE_NAME, AUTH_TOKEN_KEY } from 'shared/constants'

import { useRouter } from 'vue-router'
import { login } from '~/api/auth/login'

import { register } from '~/api/auth/register'
import { getProfile } from '~/api/auth/getProfile'

const authToken = useStorage(AUTH_TOKEN_KEY, '')
const userInfo = ref<IUser>()
const adminInfo = useStorage(ADMIN_ROLE_NAME, '')

// const quey: IQueryDto<IVerificationHistory> = {
//   relations: {
//     user: true,
//   },
// }

export function useUser(router = useRouter()) {
  /** 登录 */
  const useLogin = async (options: { password: string; account?: string; email?: string }) => {
    const res = await login({
      ...options,
      /** 加密 */
      password: encryptPasswordInHttp(options.password),
    })
    if (res) {
      authToken.value = res.sign.access_token
      userInfo.value = res.user
      router.replace({ path: '/home' })
    }
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
      router.replace({ path: '/auth/login' })
  }
  /** 默认查询当前用户的认证信息 */
  const useGetProfile = async (relation = 'role.permissions,verification') => {
    const res = await getProfile(relation)
    if (res)
      userInfo.value = res
  }

  const fetchProfile = async (relation = 'role.permissions,verification') => {
    const res = await getProfile(relation)
    adminInfo.value = res.role?.name
  }

  return {
    useRegister,
    useLogin,
    userInfo,
    authToken,
    useGetProfile,
    fetchProfile,
    adminInfo,
  }
}
