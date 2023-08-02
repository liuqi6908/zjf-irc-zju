<script setup lang="ts">
const password = ref<string>('')
const phone = ref<string>('')
const repeatPassword = ref ('')
/** 判断当前user是否已经注册 */
const userName = ref('')
const smsCode = ref('')
const repeatPasswordInput = ref()

/** 需要校验的input */
const acceptObj = reactive({
  username: false,
  repeatPassword: false,
  phone: false,
  sms: false,
})

function emailRules(val: string) {
  return (/^1[34516789]\d{9}$/.test(val)) || '请输入合法邮箱'
}
function usernameRules(val: string) {
  return val.length > 0 || '用户名不能为空'
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

const disable = computed(() => verifyAccept(acceptObj))
</script>

<template>
  <div flex="~ col">
    <span mb-1 font-500 text-grey-8>用户名称</span>
    <UserCodeInput
      v-model:userCode="userName"
      user-type="user"
      :rules="[(val:string) => usernameRules(val)]"
      @update:accept="(val) => acceptObj.username = val"
    />

    <div m-b-5 flex flex-col>
      <span mb-1 font-500 text-grey-8>密码</span>
      <PasswordInput v-model:password="password" />
    </div>

    <span mb-1 font-500 text-grey-8>确认密码</span>
    <PasswordInput
      v-model:password="repeatPassword"
      reactive-rules
      :rules="[(val:string) => passwordRule(val)]"
      @update:accept="(val) => acceptObj.repeatPassword = val"
    />

    <span mb-1 font-500 text-grey-8>邮箱</span>
    <UserCodeInput
      ref="repeatPasswordInput"
      v-model:userCode="phone"
      :rules="[(val:string) => emailRules(val)]"
      user-type="phone"
      @update:accept="(val) => acceptObj.phone = val"
    />

    <span mb-1 font-500 text-grey-8>短信验证</span>
    <SMSInput
      v-model:smsCode="smsCode"
      :rules="[(val:string) => smsCodeRule(val)]"
      :phone="phone"
      @update:accept="(val) => acceptObj.sms = val"
    />

    <Btn mt-5 w-full label="注册" :disable="disable" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: auth
</route>
