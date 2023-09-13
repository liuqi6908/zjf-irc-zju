<script setup lang="ts">
import { validateAccount, validateEmail, validatePassword } from 'zjf-utils'
import { CodeAction } from 'zjf-types'

const userName = ref('')
const password = ref('')
const repeatPassword = ref ('')
const email = ref('')
const smsCode = ref('')
const bizId = ref('')

const $router = useRouter()
const { useRegister } = useUser()

/** 需要校验的input */
const acceptObj = reactive({
  username: false,
  password: false,
  repeatPassword: false,
  email: false,
  sms: false,
})

/** 输入校验 */
function usernameRules(val: string) {
  return validateAccount(val) || true
}
function emailRules(val: string) {
  return validateEmail(val) || true
}
function passwordRules(val: string) {
  return validatePassword(val) || true
}
function passwordRule(val: string) {
  return val === password.value || '两次密码不一致'
}
function smsCodeRule(val: string) {
  return val.length === 6 || '请输入 6 位验证码'
}

async function signUp() {
  useRegister(userName.value, email.value, password.value, bizId.value, smsCode.value)
}

const disable = computed(() => Object.values(acceptObj).includes(false))
</script>

<template>
  <div w-full flex="~ col" text="14px grey-8" font-500>
    <header flex="~ flex items-center justify-center" mb-10 relative>
      <div i-mingcute:left-line cursor-pointer absolute left-0 text-xl top-0.5 @click="$router.replace({ path: 'login' })" />
      <span text-5 font-600>智能云科研平台</span>
    </header>

    <span mb-1 v-text="'用户名称'" />
    <UserCodeInput
      v-model:userCode="userName"
      label="请输入用户名称"
      user-type="user"
      :rules="[(val:string) => usernameRules(val)]"
      @update:accept="(val) => acceptObj.username = val"
    />

    <span mb-1 v-text="'密码'" />
    <PasswordInput
      v-model:password="password"
      :rules="[(val: string) => passwordRules(val)]"
      @update:accept="(val) => acceptObj.password = val"
    />

    <span mb-1 v-text="'确认密码'" />
    <PasswordInput
      v-model:password="repeatPassword"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.repeatPassword = val"
    />

    <span mb-1 v-text="'邮箱'" />
    <UserCodeInput
      v-model:userCode="email"
      label="请输入邮箱"
      :rules="[(val:string) => emailRules(val)]"
      user-type="email"
      @update:accept="(val) => acceptObj.email = val"
    />

    <span mb-1 v-text="'邮箱验证'" />
    <SMSInput
      v-model:smsCode="smsCode"
      :action="CodeAction.REGISTER"
      :email="email"
      :rules="[(val:string) => smsCodeRule(val)]"
      :disable="!acceptObj.email"
      @update:biz-id="(val) => bizId = val"
      @update:accept="(val) => acceptObj.sms = val"
    />

    <client-only>
      <Btn mt-5 w-full label="注册" :disable="disable" @click="signUp" />
    </client-only>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
