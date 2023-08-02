<script setup lang="ts">
import { validateAccount, validatePassword } from 'zjf-utils'
import { useUser } from '~/uses/useUser'

// const { $post } = useRequest()

const password = ref('')
const userCode = ref('')
const acceptObj = reactive({
  userCode: false,
  password: false,
})

const { useLogin } = useUser()

function usernameRules(val: string) {
  return validateAccount(val) || true
}
function passwordRule(val: string) {
  return validatePassword(val) || true
}

const disable = computed(() => Object.values(acceptObj).includes(false))
</script>

<template>
  <div w-full flex="~ col">
    <span m-b-4 font-500 text-grey-8>账号</span>
    <UserCodeInput
      v-model:userCode="userCode"
      user-type="user"
      :rules="[(val:string) => usernameRules(val)]"
      @update:accept="(val) => acceptObj.userCode = val"
    />

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

    <Btn :disable="disable" label="登录" @click="useLogin(password, userCode)" />

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
