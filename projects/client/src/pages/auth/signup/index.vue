<script setup lang="ts">
import { validateAccount, validateEmail } from 'zjf-utils'
import { CodeAction } from 'zjf-types'

// import { register } from '~/api/auth/register'
// import { login } from '~/api/auth/login'
import { computed, reactive, ref } from 'vue'
import { useUser } from '../../../composables/useUser'

const password = ref<string>('')
const email = ref<string>('')
const bizId = ref('')
const repeatPassword = ref ('')
const userName = ref('')
const smsCode = ref('')
const repeatPasswordInput = ref()

// const $route = useRoute()
// const $router = useRouter()

const { useRegister } = useUser()

/** 需要校验的input */
const acceptObj = reactive({
  username: false,
  repeatPassword: false,
  email: false,
  sms: false,
})

function emailRules(val: string) {
  return validateEmail(val) || true
}
function usernameRules(val: string) {
  return validateAccount(val) || true
}

function passwordRule(val: string) {
  return val === password.value || '两次密码保持一致'
}
function smsCodeRule(val: string) {
  return val.length > 0 || '验证码不能为空'
}

function verifyAccept(obj: any) {
  return Object.values(obj).includes(false)
}

async function signUp() {
  useRegister(userName.value, email.value, password.value, bizId.value, smsCode.value)
}
const disable = computed(() => verifyAccept(acceptObj))
</script>

<template>
  <div flex="~ col">
    <header flex="~ flex col items-center justify-center">
      <span text-7 font-600 text-grey-1>注册</span>
    </header>
    <span mb-1 font-500 text-grey-1>用户名称</span>
    <UserCodeInput
      v-model:userCode="userName"
      user-type="user"
      :rules="[(val:string) => usernameRules(val)]"
      @update:accept="(val) => acceptObj.username = val"
    />

    <div m-b-5 flex flex-col>
      <span mb-1 font-500 text-grey-1>密码</span>
      <PasswordInput v-model:password="password" />
    </div>

    <span mb-1 font-500 text-grey-1>确认密码</span>
    <PasswordInput
      v-model:password="repeatPassword"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.repeatPassword = val"
    />

    <span mb-1 font-500 text-grey-1>邮箱</span>
    <UserCodeInput
      ref="repeatPasswordInput"
      v-model:userCode="email"
      :rules="[(val:string) => emailRules(val)]"
      user-type="email"
      @update:accept="(val) => acceptObj.email = val"
    />
    <span mb-1 font-500 text-grey-1>短信验证</span>
    <SMSInput
      v-model:smsCode="smsCode"
      :action="CodeAction.REGISTER"
      :email="email"
      :rules="[(val:string) => smsCodeRule(val)]"
      @update:biz-id="(val) => bizId = val"
      @update:accept="(val) => acceptObj.sms = val"
    />

    <Btn mt-5 w-full label="注册" :disable="disable" @click="signUp" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
