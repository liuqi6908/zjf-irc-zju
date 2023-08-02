<script lang="ts" setup>
import type { CodeAction } from 'zjf-types'
import { smsCodeByEmail } from '~/api/auth/email/smsCodeByEmail'

const props = defineProps<Props>()
const emits = defineEmits(['update:smsCode', 'update:accept', 'update:bizId'])

interface Props {
  smsCode: string
  email: string
  action: CodeAction.REGISTER | CodeAction.LOGIN | CodeAction.CHANGE_PASSWORD
}
const wait = ref(0)

const inputRef = ref(null)

let timer: any

async function getCode() {
  const res = await smsCodeByEmail(props.email, props.action)
  if (!res)
    return
  emits('update:bizId', res.bizId)
  wait.value = 60
  timer = setInterval(() => {
    wait.value--
    if (wait.value <= 0)
      clearInterval(timer)
  }, 1000)
}

watch(() => props.smsCode, () => {
  if (inputRef.value) {
    const validate = inputRef.value?.validate(props.smsCode)
    emits('update:accept', validate)
  }
})
</script>

<template>
  <q-input
    ref="inputRef"
    dense
    label="请输入验证码"
    :model-value="smsCode"
    outlined
    lazy-rules="ondemand"
    @update:model-value="(v: string) => $emit('update:smsCode', v)"
  >
    <template #append>
      <div v-if="wait" text-4>
        {{ wait }}
      </div>
      <Btn v-else dense label="发送验证码" transparent @click="getCode" />
    </template>
  </q-input>
</template>

<style lang="">

</style>
