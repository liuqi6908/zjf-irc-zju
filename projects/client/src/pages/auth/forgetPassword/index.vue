<script lang="ts" setup>
import { validateEmail, validatePassword } from 'zjf-utils'
import { CodeAction } from 'zjf-types'

import { Notify } from 'quasar'
import { changePasswordBySms } from '~/api/auth/user/changePasswordBySms'

const email = ref('')
const smsCode = ref('')
const bizId = ref('')
const password = ref('')
const repeatPassword = ref('')

const $router = useRouter()

/** 需要校验的input */
const acceptObj = reactive({
  email: false,
  sms: false,
  password: false,
  repeatPassword: false,
})

/** 输入校验 */
function emailRules(val: string) {
  return validateEmail(val) || true
}
function smsCodeRule(val: string) {
  return val.length === 6 || '请输入 6 位验证码'
}
function passwordRules(val: string) {
  return validatePassword(val) || true
}
function passwordRule(val: string) {
  return val === password.value || '两次密码不一致'
}

async function finish() {
  const res = await changePasswordBySms(email.value, password.value, bizId.value, smsCode.value)
  if (res) {
    Notify.create({
      type: 'success',
      message: '修改密码成功',
    })
    $router.replace('/auth/login')
  }
}

const disable = computed(() => Object.values(acceptObj).includes(false))
</script>

<template>
  <div w-full flex="~ col" text="sm grey-1" font-500>
    <header flex="~ flex items-center" mb-14 relative>
      <div cursor-pointer text-xl i-mingcute:left-line w-5.5 @click="$router.replace({ path: 'login' })" />
      <span font-600 text-7 absolute-x-center>邮箱找回</span>
    </header>

    <span mb-2 v-text="'邮箱'" />
    <UserCodeInput
      v-model:userCode="email"
      label="请输入邮箱"
      :rules="[(val:string) => emailRules(val)]"
      user-type="email"
      @update:accept="(val) => acceptObj.email = val"
    />

    <span mb-2 v-text="'邮箱验证'" />
    <SMSInput
      v-model:smsCode="smsCode"
      :action="CodeAction.CHANGE_PASSWORD"
      :email="email"
      :rules="[(val:string) => smsCodeRule(val)]"
      :disable="!acceptObj.email"
      @update:biz-id="(val) => bizId = val"
      @update:accept="(val) => acceptObj.sms = val"
    />

    <span mb-2 v-text="'密码'" />
    <PasswordInput
      v-model:password="password"
      :rules="[(val: string) => passwordRules(val)]"
      @update:accept="(val) => acceptObj.password = val"
    />

    <span mb-2 v-text="'确认密码'" />
    <PasswordInput
      v-model:password="repeatPassword"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.repeatPassword = val"
    />

    <client-only>
      <Btn color="primary-1" bg-color="grey-1" h="12!" mt-20 :disable="disable" @click="finish">
        <div text-base font-600>完成</div>
      </Btn>
    </client-only>
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
