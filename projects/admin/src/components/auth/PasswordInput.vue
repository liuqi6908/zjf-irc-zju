<script setup lang="ts">
import { QInput } from 'quasar'

const props = defineProps<Props>()
const emits = defineEmits(['update:password', 'update:accept'])

const inputRef = ref<typeof QInput>()
const isPwd = ref(true)

interface Props {
  password: string
  rules?: Array<any>
  reactiveRules?: boolean
}

watch(() => props.password, () => {
  emits('update:accept', inputRef.value?.validate(props.password))
})
</script>

<template>
  <QInput
    ref="inputRef"
    :reactive-rules="reactiveRules"
    :rules="rules"
    :model-value="password"
    outlined
    dense
    :type="isPwd ? 'password' : 'text'"
    label="请输入密码"
    @update:model-value="v => $emit('update:password', v)"
  >
    <template #append>
      <div
        :class="isPwd ? 'i-mingcute:eye-close-line' : 'i-mingcute:eye-2-line' "
        cursor-pointer text-grey-5
        @click="isPwd = !isPwd"
      />
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
