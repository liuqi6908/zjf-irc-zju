<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'
import { useUser } from '~/composables/useUser'

// const { $post } = useRequest()

const password = ref('')
const userCode = ref('')
const acceptObj = reactive({
  password: false,
})

const { useLogin, userInfo } = useUser()

function passwordRule(val: string) {
  return validatePassword(val) || true
}

const logArg = computed(() =>
  validateEmail(userCode.value) ? { password: password.value, account: userCode.value } : { password: password.value, email: userCode.value })

const disable = computed(() => Object.values(acceptObj).includes(false))
</script>

<template>
  <div w-full flex="~ col">
    <span m-b-4 font-500 text-grey-8>账号</span>
    <UserCodeInput
      v-model:userCode="userCode"
    />
    {{ userInfo }}
    <span m-b-4 m-t-4 font-500 text-grey-8>
      密码
    </span>
    <PasswordInput
      v-model:password="password"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.password = val"
    />

    <div h-20 />

    <Btn :disable="disable" label="登录" @click="useLogin(logArg)" />

    <div m-t-5 flex-center text-grey-5>
      没有账号？
      <RouterLink text-primary-1 :to="{ path: '/signup' }">
        立即注册
      </RouterLink>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
