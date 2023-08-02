<script setup lang="ts">
import { useUser } from '~/uses/useUser'

// const { $post } = useRequest()

const password = ref('')
const userCode = ref('')

const { useLogin } = useUser()
</script>

<template>
  <div w-full flex="~ col">
    <span m-b-4 font-500 text-grey-8>账号</span>
    <UserCodeInput
      v-model:userCode="userCode"
      label="请输入账号"
    />

    <span m-b-4 m-t-4 font-500 text-grey-8>
      密码
    </span>
    <PasswordInput v-model:password="password" />

    <div h-20 />

    <Btn label="登录" @click="useLogin(password, userCode)" />

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
