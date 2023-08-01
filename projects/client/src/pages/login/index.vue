<script setup lang="ts">
const password = ref('')
const userCode = ref('')
</script>

<template>
  <div w-full flex="~ col">
    <span m-b-4 font-500 text-grey-8>账号</span>
    <UserCodeInput
      v-model:userCode="userCode"
    />

    <span m-b-4 m-t-4 font-500 text-grey-8>
      密码
    </span>
    <PasswordInput v-model:password="password" />

    <div h-20 />

    <Btn label="登录" />

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
