import { encryptPasswordInHttp } from 'zjf-utils'
import { ADMIN_ROLE_PERMISSION_KEY } from 'shared/constants'
import { Dialog, Notify } from 'quasar'

import { getProfile } from '~/api/auth/getProfile'
import { login } from '~/api/auth/login'
import { logout } from '~/api/auth/logout'
import { register } from '~/api/auth/register'

const rolePermission = useStorage<string[]>(ADMIN_ROLE_PERMISSION_KEY, [])

export function useUser($router = useRouter()) {
  /**
   * 登录
   */
  async function useLogin(options: {
    password: string
    account?: string
    email?: string
  }) {
    const res = await login({
      ...options,
      /** 加密 */
      password: encryptPasswordInHttp(options.password),
    })
    if (res) {
      const { sign, user } = res
      authToken.value = sign.access_token
      userInfo.value = user
      await useGetProfile()
      $router.push('/home')
    }
  }

  /**
   * 注册
   */
  async function useRegister(
    account: string,
    email: string,
    password: string,
    bizId: string,
    code: string,
  ) {
    const res = await register(account, email, encryptPasswordInHttp(password), bizId, code)
    if (res) {
      Notify.create({
        type: 'success',
        message: '注册成功',
      })
      await useLogin({ password, account, email })
    }
  }

  /**
   * 登出
   */
  function useLogout() {
    Dialog.create({
      title: '退出登录',
      message: '是否退出登录？',
      cancel: '取消',
      ok: '确认',
    })
      .onOk(async () => {
        $router.push('/auth/login')
        await logout()
        authToken.value = null
        userInfo.value = undefined
        rolePermission.value = null
      })
  }

  /**
   * 获取当前登入用户信息
   */
  async function useGetProfile(relation = 'role.permissions') {
    const res = await getProfile(relation)
    if (res) {
      userInfo.value = res
      const permissions = res.role?.permissions?.map(v => v.name)
      rolePermission.value = rolePermissionsToLabel(permissions)
    }
  }

  /**
   * 用户是否登录
   */
  const isLogin = computed(() => !!authToken.value)

  return {
    authToken,
    userInfo,
    rolePermission,
    isLogin,
    useLogin,
    useRegister,
    useLogout,
    useGetProfile,
  }
}
