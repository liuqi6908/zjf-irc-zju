<script lang="ts" setup>
import type { CodeAction } from 'zjf-types'
import { Notify, QInput } from 'quasar'
import { smsCodeByEmail } from '~/api/auth/email/smsCodeByEmail'

interface Props {
  smsCode: string
  email: string
  action: CodeAction
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dark: true,
})
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
          :class="{
            ...(
              dark ? {
                'bg-white/20': true,
                'text-white': true,
                'hover:bg-white/30': true,
              } : {
                'bg-primary-1/12': true,
                'text-primary-1': true,
                'hover:bg-primary-1/16': true,
              }
            ),
          }"
          label="发送验证码"
          cursor-pointer px3 py2 text-sm
          @click="getCode()"
        >
          发送验证码
        </div>
      </div>
    </template>
    <template #error>
      <div>error</div>
    </template>
  </QInput>
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
