<script lang="ts" setup>
interface Props {
  modelValue: string
  rules?: any[] | any
  label?: string
  errored?: boolean
}
withDefaults(defineProps<Props>(), {})
const emits = defineEmits<{
  'update:modelValue': [val: string]
  'update:errored': [val: boolean]
}>()

// refs
const inputRef = ref<any>(null)

function onChange(e: any) {
  emits('update:modelValue', e)
  emits('update:errored', inputRef.value?.validate(e))
}
</script>

<template>
  <q-input
    ref="inputRef"
    :label="label"
    :model-value="modelValue"
    :rules="rules"
    outlined
    square
    @update:model-value="onChange"
  />
</template>
