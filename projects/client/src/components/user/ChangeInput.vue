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
}
const props = defineProps<Props>()
defineEmits(['update:userCode', 'update:edit', 'update:confirm', 'update:bizId', 'update:smsCode'])
const { userInfo } = useUser()
const dialog = ref(false)

/**
 * 校验邮箱
 * @param val
 */
function emailRules(val = '') {
  return validateEmail(val) || true
}

/**
 * 校验密码
 * @param val
 */
function passwordRules(val = '') {
  return validatePassword(val) || true
}

const disable = computed(() => {
  const { label, edit, smsCode, bizId } = props
  return (label === '邮箱' ? emailRules(edit) : passwordRules(edit)) !== true || !smsCode || !bizId
})
</script>

<template>
  <section>
    <div mb2 flex="~ row items-center justify-between">
      <div text-3.5>
        <span font-600 text-grey-8>
          {{ label }}
        </span>
        <span text-grey-6>（{{ captions }}）</span>
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
        <Btn v-if="label !== '用户名'" outline label="修改" :disable="label === '密码' && !userInfo?.email" @click="dialog = true" />
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
        :rules="[(val: string) => label === '邮箱' ? emailRules(val) : passwordRules(val)]"
        @update:user-code="(v) => $emit('update:edit', v)"
      />

      <div v-if="action" mt6>
        <div mb2 font-bold text-grey-8>
          邮箱验证
        </div>
        <SMSInput
          :email="id === 'email' ? edit : userInfo?.email"
          :action="action"
          :dark="false"
          :sms-code="smsCode"
          @update:sms-code="(val) => $emit('update:smsCode', val)"
          @update:biz-id="(val) => $emit('update:bizId', val)"
        />
      </div>
    </ZDialog>
  </section>
</template>

<style lang="">

</style>
