<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'

const { useLogin } = useUser()

const userCode = ref('')
const password = ref('')
const registerPlatform = ref<0 | 1>(0)
const acceptObj = reactive({
  password: false,
})

function passwordRule(val: string) {
  return validatePassword(val) || true
}

const logArg = computed(() => {
  return {
    password: password.value,
    registerPlatform: registerPlatform.value,
    [validateEmail(userCode.value) ? 'account' : 'email']: userCode.value
  }
})

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
    <span  v-text="'注册用户类型'" />
    <div flex gap-4>
      <q-radio
        v-for="(item, index) in userRegisterPlatform"
        :key="index"
        v-model="registerPlatform"
        :val="index"
        :label="item"
      />
    </div>

    <RouterLink text-grey-5 text-xs mt-2 :to="{ path: 'forgetPassword' }" v-text="'忘记密码?'" />

    <client-only>
      <Btn mt-13 :disable="disable" label="登录" @click="useLogin(logArg)" />
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
