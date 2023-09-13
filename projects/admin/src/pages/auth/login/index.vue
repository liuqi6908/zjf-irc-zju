<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'

const { useLogin } = useUser()

const userCode = ref('')
const password = ref('')
const acceptObj = reactive({
  password: false,
})

function passwordRule(val: string) {
  return validatePassword(val) || true
}

const logArg = computed(() =>
  validateEmail(userCode.value) ? { password: password.value, account: userCode.value } : { password: password.value, email: userCode.value })

const disable = computed(() => !userCode.value || Object.values(acceptObj).includes(false))

/**
 * 按下回车键，登录
 */
function handleEnter() {
  if (!disable.value)
    useLogin(logArg.value)
}
</script>

<template>
  <div w-full flex="~ col" font-500 text-grey-8>
    <header flex="~ flex col items-center justify-center" mb-2>
      <span font-600 text-grey-8 text-5 v-text="'智能云科研平台'" />
    </header>
    <span mb-1 v-text="'账号 / 邮箱'" />
    <UserCodeInput
      v-model:userCode="userCode"
      label="请输入账号/邮箱"
    />
    <span mb-1 mt-4 v-text="'密码'" />
    <PasswordInput
      v-model:password="password"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.password = val"
      @keydown.enter="handleEnter()"
    />

    <RouterLink text-grey-5 text-xs :to="{ path: 'forgetPassword' }" v-text="'忘记密码?'" />

    <client-only>
      <Btn mt-15 :disable="disable" label="登录" @click="useLogin(logArg)" />
    </client-only>

    <div mt-5 flex-center text-grey-5>
      没有账号？
      <RouterLink text-primary-1 :to="{ path: 'signup' }" v-text="'立即注册'" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
