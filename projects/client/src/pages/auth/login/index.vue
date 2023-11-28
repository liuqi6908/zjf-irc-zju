<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'
import { ErrorCode } from 'zjf-types'

const { useLogin } = useUser()
const $router = useRouter()

const userCode = ref('')
const password = ref('')
const acceptObj = reactive({
  password: false,
})

/** 登录提示对话框 */
const dialog = ref(false)

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
    await useLogin(logArg.value)
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

    <RouterLink text-grey-1 font-400 mt-2 :to="{ path: 'forgetPassword' }" v-text="'忘记密码？'" />

    <client-only>
      <Btn color="primary-1" mt-20 h="12!" bg-color="grey-1" :disable="disable" @click="handleEnter">
        <div text-base font-600>登录</div>
      </Btn>
    </client-only>

    <div flex-center mt-4 font-400>
      <span text-white-7>没有账号？</span>
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
      区域发展政策大脑用户第一次登录本平台，需要设置初始密码，请前往“邮箱找回”设置密码。
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
