<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { validateEmail, validatePassword } from 'zjf-utils'
import { useUser } from '../../../composables/useUser'

// const { $post } = useRequest()
const password = ref('')
const userCode = ref('')
const acceptObj = reactive({
  password: false,
})

const { useLogin } = useUser()

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
  <div w-full flex="~ col">
    <header flex="~ flex col items-center justify-center" mb-12>
      <span font-600 text-7 text-grey-1 v-text="'登录'" />
    </header>
    <span text-grey-1 font-500 m-b-1 v-text="'账号 / 邮箱'" />
    <UserCodeInput
      v-model:userCode="userCode"
      label="请输入账号/邮箱"
    />
    <span m-b-1 font-500 text-grey-1 m-t-4 v-text="'密码'" />
    <PasswordInput
      v-model:password="password"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.password = val"
      @keydown.enter="handleEnter()"
    />
    <RouterLink text-grey-1 text-3 :to="{ path: 'forgetPassword' }" v-text="'忘记密码？'" />

    <div h-20 />

    <client-only>
      <Btn color="primary-1" bg-color="grey-1" :disable="disable" label="登录" @click="useLogin(logArg)" />
    </client-only>

    <div flex-center m-t-5 text-grey-3>
      没有账号？
      <RouterLink text-grey-1 :to="{ path: 'signup' }" v-text="'立即注册'" />
    </div>
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
