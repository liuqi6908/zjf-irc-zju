import { useStorage } from '@vueuse/core'
import { VerificationStatus } from 'zjf-types'
import type { IVerificationHistory } from 'zjf-types'
import { encryptPasswordInHttp } from 'zjf-utils'
import { AUTH_TOKEN_KEY } from 'shared/constants'
import { getProfile } from '~/api/auth/getProfile'
import { login } from '~/api/auth/login'
import { logout } from '~/api/auth/logout'
import { register } from '~/api/auth/register'

/** 用户token */
export const authToken = useStorage(AUTH_TOKEN_KEY, '')
/** 认证信息 */
const latestVerifiy = ref<IVerificationHistory>()
/** 是否云桌面 */
const isDesktop = ref(false)
let isDesktopFetched = false

const { $get } = useRequest()

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
    const res = await register(account, email, encryptPasswordInHttp(password), bizId, code)
    if (res)
      await useLogin({ password, account, email })
  }

  /** 登出 */
  const useLogout = () => {
    logout()
    authToken.value = null
    userInfo.value = undefined
    $router.replace({ path: '/' })
  }

  /** 获取当前登入用户信息 */
  const useGetProfile = async (relation = 'role.permissions,verification') => {
    const res = await getProfile(relation)
    if (res)
      userInfo.value = res
  }

  /** 获取当前登入用户认证信息 */
  const getVerify = async () => {
    latestVerifiy.value = await $get<IVerificationHistory>('/verification/latest')
    return latestVerifiy.value
  }

  /** 用户是否登录 */
  const isLogin = computed(() => !!authToken.value)

  /** 用户是否通过认证 */
  const isVerify = computed(() => userInfo.value?.verification?.status === VerificationStatus.APPROVED)

  onMounted(async () => {
    if (!isDesktopFetched) {
      isDesktopFetched = true
      isDesktop.value = await $get('desktop/is')
    }
  })

  return {
    userInfo,
    authToken,
    isLogin,
    isVerify,
    latestVerifiy,
    isDesktop,
    useLogin,
    useRegister,
    useLogout,
    useGetProfile,
    getVerify,
  }
}
