<script setup lang="ts">
import { validateEmail, validatePassword, decryptPasswordInHttp } from 'zjf-utils'
import { ErrorCode } from 'zjf-types'
import { REMEMBER_LOGIN_INFO_KEY } from 'shared/constants/token.constant'

const { useLogin } = useUser()
const $router = useRouter()

const userCode = ref('')
const password = ref('')
const rememberPassword = ref(false)
const acceptObj = reactive({
  password: false,
})

/** 登录提示对话框 */
const dialog = ref(false)

onBeforeMount(() => {
  try {
    const loginInfo = JSON.parse(localStorage.getItem(REMEMBER_LOGIN_INFO_KEY) || '{}')
    if (loginInfo.userCode && loginInfo.password) {
      userCode.value = loginInfo.userCode
      password.value = decryptPasswordInHttp(loginInfo.password)
      acceptObj.password = true
      rememberPassword.value = true
    }
  }
  catch (_) {}
})

function passwordRule(val: string) {
  return validatePassword(val) || true
}

const logArg = computed(() => {
  return {
    password: password.value,
    [validateEmail(userCode.value) ? 'account' : 'email']: userCode.value
  }
})

const disable = computed(() => !userCode.value || Object.values(acceptObj).includes(false))

/**
 * 按下回车键，登录
 */
async function handleEnter() {
  if (disable.value)
    return

  try {
    await useLogin(logArg.value, rememberPassword.value)
  }
  catch (e: any) {
    const { status } = e.response?.data || {}
    if (status === ErrorCode.AUTH_PASSWORD_IS_NULL)
      dialog.value = true
  }
}
</script>

<template>
  <div w-full flex="~ col" text="sm grey-1" font-500>
    <header flex="~ flex col items-center justify-center" mb-12>
      <span font-600 text-7 v-text="'登录'" />
    </header>
    <span mb-2 v-text="'账号 / 邮箱'" />
    <UserCodeInput
      v-model:userCode="userCode"
      label="请输入账号/邮箱"
    />
    <span mb-2 mt-6 v-text="'密码'" />
    <PasswordInput
      v-model:password="password"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.password = val"
      @keydown.enter="handleEnter()"
    />

    <q-checkbox
      v-model="rememberPassword"
      dark color="primary" size="sm"
      label="记住账号密码"
      relative right-2
    />

    <RouterLink text-grey-1 font-400 mt-4 :to="{ path: 'forgetPassword' }" v-text="'忘记密码？'" />

    <client-only>
      <Btn color="primary-1" mt-20 h="12!" bg-color="grey-1" :disable="disable" @click="handleEnter">
        <div text-base font-600>登录</div>
      </Btn>
    </client-only>

    <div flex-center mt-4 font-400>
      <span text-transparency-7>没有账号？</span>
      <RouterLink text-grey-1 :to="{ path: 'signup' }" v-text="'立即注册'" />
    </div>

    <!-- 登录提示对话框 -->
    <ZDialog
      v-model="dialog"
      title="提示"
      confirm-text="立即前往"
      footer
      @ok="$router.push('forgetPassword')"
    >
      您登录的账号密码不存在，为了您的账号安全，请先前往“邮箱找回”设置初始密码。
    </ZDialog>
  </div>
</template>

<style scoped>
:deep(.q-field__label) {
  color: rgba(255, 255, 255, 0.7) !important;
}
</style>

<route lang="yaml">
meta:
  layout: auth
</route>
