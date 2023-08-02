<script lang="ts" setup>
const props = defineProps<Props>()
const emits = defineEmits(['update:smsCode', 'update:accept'])

interface Props {
  smsCode: string
  phone: string
}
const wait = ref(0)
const isSent = ref(false)
const inputRef = ref(null)

let timer

function getCode() {
  wait.value = 60
  timer = setInterval(() => {
    wait.value--
    if (wait.value <= 0)
      clearInterval(timer)
  }, 1000)
}

watch(() => props.smsCode, () => {
  if (inputRef.value) {
    const validate = inputRef.value.validate(props.smsCode)
    emits('update:accept', validate)
  }
})
</script>

<template>
  <q-input
    ref="inputRef"
    label="请输入验证码"
    :model-value="smsCode"
    outlined
    @update:model-value="(v: string) => $emit('update:smsCode', v)"
  >
    <template #append>
      <div v-if="wait">
        {{ wait }}
      </div>
      <Btn v-else label="发送验证码" transparent @click="getCode" />
    </template>
  </q-input>
</template>

<style lang="">

</style>
