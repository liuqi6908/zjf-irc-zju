<script lang="ts" setup>
import { validateEmail } from 'zjf-utils'
import { CodeAction } from 'zjf-types'

import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { Notify } from 'quasar'
import { changePasswordBySms } from '~/api/auth/user/changePasswordBySms'

const password = ref<string>('')
const email = ref<string>('')
const bizId = ref('')
const repeatPassword = ref ('')
const smsCode = ref('')

// const $route = useRoute()
// const $router = useRouter()

const router = useRouter()

/** 需要校验的input */
const acceptObj = reactive({
  repeatPassword: false,
  email: false,
  sms: false,
})

function emailRules(val: string) {
  return validateEmail(val) || true
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

async function finish() {
  const res = await changePasswordBySms(email.value, password.value, bizId.value, smsCode.value)
  if (!res)
    return
  Notify.create({ type: 'success', message: '修改密码完成' })
  router.replace('/auth/login')
}

const disable = computed(() => verifyAccept(acceptObj))
</script>

<template>
  <div w-full flex="~ col">
    <header flex="~ flex row items-center justify-between " mb-10>
      <div i-mingcute:left-line h-8 w-8 cursor-pointer text-grey-1 @click="router.replace({ path: 'login' })" />   <span text-7 font-600 text-grey-1>邮箱找回</span> <span />
    </header>
    <span mb-2 text-14px font-500 text-grey-1>
      邮箱
    </span>
    <UserCodeInput
      v-model:userCode="email"
      :rules="[(val:string) => emailRules(val)]"
      user-type="email"
      @update:accept="(val) => acceptObj.email = val"
    />

    <span mb-2 text-14px font-500 text-grey-1>
      邮箱验证
    </span>
    <SMSInput
      v-model:smsCode="smsCode"
      :disable-send="!email"
      :action="CodeAction.CHANGE_PASSWORD"
      :email="email"
      :rules="[(val:string) => smsCodeRule(val)]"
      @update:biz-id="(val) => bizId = val"
      @update:accept="(val) => acceptObj.sms = val"
    />

    <div m-b-5 flex flex-col>
      <span mb-1 font-500 text-grey-1>密码</span>
      <PasswordInput v-model:password="password" />
    </div>

    <span mb-2 text-14px font-500 text-grey-1>
      确认密码
    </span>
    <PasswordInput
      v-model:password="repeatPassword"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.repeatPassword = val"
    />

    <client-only>
      <Btn color="primary-1" bg-color="grey-1" mt-5 w-full label="完成" :disable="disable" @click="finish" />
    </client-only>
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
