<script setup lang="ts">
import { QInput } from 'quasar'

interface Props {
  password: string
  rules?: Array<any>
  reactiveRules?: boolean
}

const props = defineProps<Props>()
const emits = defineEmits(['update:password', 'update:accept'])

const inputRef = ref<typeof QInput>()
const isPwd = ref(true)

watch(
  () => props.password,
  () => {
    emits('update:accept', inputRef.value?.validate(props.password))
  },
)
</script>

<template>
  <QInput
    ref="inputRef"
    :reactive-rules="reactiveRules"
    :rules="rules"
    :model-value="password"
    outlined
    dense
    dark
    :type="isPwd ? 'password' : 'text'"
    label="请输入密码"
    @update:model-value="v => $emit('update:password', v)"
  >
    <template #append>
      <div
        :class="isPwd ? 'i-material-symbols:visibility-off-outline' : 'i-material-symbols:visibility-outline' "
        cursor-pointer
        @click="isPwd = !isPwd"
      />
    </template>
  </QInput>
</template>

<style lang="scss" scoped>
$error-color:#FF8080;

.q-field :deep(.q-field__inner){
    .q-field__control {
      border-radius: 0px !important;
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
