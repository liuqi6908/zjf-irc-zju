<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
  dark: true,
})
const emits = defineEmits(['update:userCode', 'update:accept'])

interface Props {
  userCode: string
  accept?: boolean
  rule?: Array<any>
  disable?: boolean
  dark?: boolean
}

const inputRef = ref(null)

watch(() => props.userCode, () => {
  if (inputRef.value) {
    const validate = inputRef.value.validate(props.userCode)
    emits('update:accept', validate)
  }
})
</script>

<template>
  <q-input
    ref="inputRef"
    :disable="disable"
    :model-value="userCode"
    dense outlined
    :dark="dark"
    :rules="rule"
    @input="debounce ? handleDebounceInput($event) : handleInput($event)"
    @update:model-value="(v) => $emit('update:userCode', v)"
  >
    <template #prepend>
      <slot name="prepend" />
    </template>
  </q-input>
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
