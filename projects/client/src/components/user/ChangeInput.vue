<script setup lang="ts">
import { validateEmail, validatePassword } from 'zjf-utils'

interface Props {
  id: string
  edit?: string
  userCode?: string
  smsCode?: string
  bizId?: string
  label?: string
  captions?: string
  action?: string
  registerPlatform?: 0 | 1
}

defineProps<Props>()
defineEmits(['update:userCode', 'update:edit', 'update:confirm', 'update:bizId', 'update:smsCode'])
const { userInfo } = useUser()
const dialog = ref(false)

/** 需要校验的input */
const acceptObj = reactive({
  edit: false,
  sms: false,
})

/** 输入校验 */
function emailRules(val = '') {
  return validateEmail(val) || true
}
function passwordRules(val = '') {
  return validatePassword(val) || true
}
function smsCodeRules(val = '') {
  return val.length === 6 || '请输入 6 位验证码'
}

const disable = computed(() => Object.values(acceptObj).includes(false))
</script>

<template>
  <section>
    <div mb2 flex="~ row items-center justify-between">
      <div text-3.5>
        <span font-600 text-grey-8>
          {{ label }}
        </span>
        <span
          v-if="captions"
          text-grey-6
          v-text="`（${captions}）`"
        />
      </div>
    </div>

    <div flex="~ row" gap10>
      <div
        flex="~ 1"
        h12 items-center border-1 border-gray-3 bg-gray-2 px3 py2
        text="4 gray-4 left"
      >
        {{ userCode }}
      </div>
      <div min-w-20>
        <Btn v-if="label !== '用户名' && label !== '注册平台'" outline label="修改" :disable="label === '密码' && !userInfo?.email" @click="dialog = true" />
      </div>
    </div>

    <ZDialog
      v-model="dialog"
      :title="`修改${label}`"
      :footer="true"
      :disable-confirm="disable"
      @ok="() => $emit('update:confirm', id)"
    >
      <div mb2 font-bold text-grey-8>
        {{ label }}
      </div>

      <UserCodeInput
        :dark="false"
        :user-code="edit"
        :label="`请输入${label}`"
        :rules="[(val: string) => id === 'email' ? emailRules(val) : passwordRules(val)]"
        @update:user-code="(v) => $emit('update:edit', v)"
        @update:accept="(val) => acceptObj.edit = val"
      />

      <div v-if="action" mt6>
        <div mb2 font-bold text-grey-8>
          邮箱验证
        </div>
        <SMSInput
          :sms-code="smsCode"
          :action="action"
          :email="id === 'email' ? edit : userInfo?.email"
          :registerPlatform="registerPlatform"
          :dark="false"
          :rules="[(val: string) => smsCodeRules(val)]"
          :disable="id === 'email' && !acceptObj.edit"
          @update:biz-id="(val) => $emit('update:bizId', val)"
          @update:sms-code="(val) => $emit('update:smsCode', val)"
          @update:accept="(val) => acceptObj.sms = val"
        />
      </div>
    </ZDialog>
  </section>
</template>

<style lang="">

</style>
