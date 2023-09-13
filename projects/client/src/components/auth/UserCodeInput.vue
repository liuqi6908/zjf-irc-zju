<script setup lang="ts">
import { QInput } from 'quasar'

interface Props {
  userCode: string
  accept?: boolean
  rule?: Array<any>
  disable?: boolean
  dark?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  dark: true,
})
const emits = defineEmits(['update:userCode', 'update:accept'])

const inputRef = ref<typeof QInput>()

watch(
  () => props.userCode,
  () => {
    emits('update:accept', inputRef.value?.validate(props.userCode))
  },
)
</script>

<template>
  <QInput
    ref="inputRef"
    :disable="disable"
    :model-value="userCode"
    dense outlined
    :dark="dark"
    :rules="rule"
    @update:model-value="v => $emit('update:userCode', v)"
  >
    <template #prepend>
      <slot name="prepend" />
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
