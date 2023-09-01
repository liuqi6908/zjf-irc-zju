<script setup lang="ts">
import { validateAccount, validateEmail, validatePassword } from 'zjf-utils'
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
const router = useRouter()

// const $route = useRoute()
// const $router = useRouter()

const { useRegister } = useUser()

/** 需要校验的input */
const acceptObj = reactive({
  username: false,
  password: false,
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
  if (!email.value.length)
    return '请先输入邮箱'

  return val.length > 0 || '验证码不能为空'
}

function verifyAccept(obj: any) {
  return Object.values(obj).includes(false)
}

function passwordRules(val: string) {
  return validatePassword(val) || true
}

async function signUp() {
  useRegister(userName.value, email.value, password.value, bizId.value, smsCode.value)
}
const disable = computed(() => verifyAccept(acceptObj))
</script>

<template>
  <div flex="~ col">
    <header flex="~ flex row items-center justify-between " mb-10>
      <div class="i-mingcute:left-line" h-6 w-6 cursor-pointer text-grey-1 @click="router.replace({ path: 'login' })" />
      <span text-grey-1 title-2>注册</span>
      <span />
    </header>
    <span mb-2 font-500 text-grey-1>用户名称</span>
    <UserCodeInput
      v-model:userCode="userName"
      user-type="user"
      :rules="[(val:string) => usernameRules(val)]"
      @update:accept="(val) => acceptObj.username = val"
    />

    <div mb-2 flex flex-col>
      <span mb-1 font-500 text-grey-1>密码</span>
      <PasswordInput v-model:password="password" :rules="[(val:string) => passwordRules(val)]" @update:accept="val => acceptObj.password = val" />
    </div>

    <span mb-2 font-500 text-grey-1>确认密码</span>
    <PasswordInput
      v-model:password="repeatPassword"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.repeatPassword = val"
    />

    <span mb-2 font-500 text-grey-1>邮箱</span>
    <UserCodeInput
      ref="repeatPasswordInput"
      v-model:userCode="email"
      :rules="[(val:string) => emailRules(val)]"
      user-type="email"
      @update:accept="(val) => acceptObj.email = val"
    />
    <span mb-2 font-500 text-grey-1>邮箱验证</span>
    <SMSInput
      v-model:smsCode="smsCode"
      :action="CodeAction.REGISTER"
      :email="email"
      :rules="[(val:string) => smsCodeRule(val)]"
      @update:biz-id="(val) => bizId = val"
      @update:accept="(val) => acceptObj.sms = val"
    />

    <client-only>
      <Btn color="primary-1" bg-color="grey-1" mt-5 w-full label="注册" :disable="disable" @click="signUp" />
    </client-only>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
