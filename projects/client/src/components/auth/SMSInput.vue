<script lang="ts" setup>
import type { CodeAction } from 'zjf-types'
import { smsCodeByEmail } from '~/api/auth/email/smsCodeByEmail'

const props = withDefaults(defineProps<Props>(), {
  dark: true,
})
const emits = defineEmits(['update:smsCode', 'update:accept', 'update:bizId'])

interface Props {
  smsCode: string
  email: string
  action: CodeAction
  dark?: boolean
}
const wait = ref(0)

const inputRef = ref<any>(null)
const validate = ref(null)

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
    validate.value = inputRef.value?.validate(props.smsCode)
    emits('update:accept', validate.value)
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
    :dark="dark"
    lazy-rules="ondemand"
    @update:model-value="(v: any) => $emit('update:smsCode', v)"
  >
    <template #append>
      <div flex="~" items-center justify-center>
        <div v-if="wait" text-4>
          {{ wait }}
        </div>
        <div
          v-else
          bg="white/20"
          hover:bg="white/30"
          label="发送验证码"
          cursor-pointer px2 py1 text-sm text-white
          @click="() => !validate ? null : getCode()"
        >
          发送验证码
        </div>
      </div>
    </template>
    <template #error>
      <div>error</div>
    </template>
  </q-input>
</template>

<style lang="scss" scoped>
$error-color:#FF8080;

.q-field :deep(.q-field__inner){
    .q-field__control {
      border-radius: 0px !important;
      padding-right: 8px;
    }
    .q-field__bottom .q-field__messages{
      color: $error-color  !important;
      color: $error-color !important
    }
}
.q-input :deep(.text-negative) {
      color: $error-color !important
}
</style>
