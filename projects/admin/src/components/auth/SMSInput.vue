<script lang="ts" setup>
import type { CodeAction } from 'zjf-types'
import { Notify, QInput } from 'quasar'
import { smsCodeByEmail } from '~/api/auth/email/smsCodeByEmail'

interface Props {
  smsCode: string
  email: string
  action: CodeAction
}

const props = defineProps<Props>()
const emits = defineEmits(['update:smsCode', 'update:accept', 'update:bizId'])

const inputRef = ref<typeof QInput>()
const wait = ref(0)

async function getCode() {
  const res = await smsCodeByEmail(props.email, props.action)
  if (res) {
    Notify.create({
      type: 'success',
      message: '发送成功',
    })
    emits('update:bizId', res.bizId)
    wait.value = 60
    const { pause, resume } = useIntervalFn(() => {
      wait.value--
      if (wait.value <= 0)
        pause()
    }, 1000)
    resume()
  }
}

watch(
  () => props.smsCode,
  () => {
    emits('update:accept', inputRef.value?.validate(props.smsCode))
  },
)
</script>

<template>
  <QInput
    ref="inputRef"
    dense
    label="请输入验证码"
    :model-value="smsCode"
    outlined
    lazy-rules="ondemand"
    @update:model-value="v => $emit('update:smsCode', v)"
  >
    <template #append>
      <div v-if="wait" text-4>
        {{ wait }}
      </div>
      <Btn v-else dense label="发送验证码" transparent @click="getCode()" />
    </template>
  </QInput>
</template>

<style lang="scss" scoped>
.q-field :deep(.q-field__inner){
    .q-field__control {
      border-radius: 8px !important;
    }
    .q-field__control:before{
      border: 1px solid var(--grey-3, #D4DDEA); ;
    }
}
</style>
