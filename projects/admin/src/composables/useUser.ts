import { useStorage } from '@vueuse/core'
import type { IUser } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { ADMIN_ROLE_NAME, AUTH_TOKEN_KEY } from 'shared/constants'
import { Dialog, Notify } from 'quasar'

import { login } from '~/api/auth/login'
import { logout } from '~/api/auth/logout'
import { register } from '~/api/auth/register'
import { getProfile } from '~/api/auth/getProfile'

/** 用户token */
const authToken = useStorage(AUTH_TOKEN_KEY, '')
const userInfo = ref<IUser>()
const adminInfo = useStorage(ADMIN_ROLE_NAME, '')

export function useUser($router = useRouter()) {
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
      $router.replace({ path: '/' })
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
    const res = await register(account, email, encryptPasswordInHttp(password), bizId, code)
    if (res) {
      Notify.create({
        type: 'success',
        message: '注册成功',
      })
      await useLogin({ password, account, email })
    }
  }

  /** 登出 */
  const useLogout = () => {
    Dialog.create({
      title: '退出登录',
      message: '是否退出登录',
      cancel: '取消',
      ok: '确认',
    })
      .onOk(() => {
        logout()
        authToken.value = null
        userInfo.value = undefined
        $router.replace({ path: '/auth/login' })
      })
  }

  /** 获取当前登入用户信息 */
  const useGetProfile = async (relation = 'role.permissions,verification') => {
    const res = await getProfile(relation)
    if (res) {
      userInfo.value = res
      adminInfo.value = res.role?.name
    }
  }

  /** 用户是否登录 */
  const isLogin = computed(() => !!authToken.value)

  return {
    authToken,
    userInfo,
    adminInfo,
    isLogin,
    useLogin,
    useRegister,
    useLogout,
    useGetProfile,
  }
}
