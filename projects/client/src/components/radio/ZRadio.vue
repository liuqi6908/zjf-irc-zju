<script lang="ts" setup>
interface Props {
  modelValue: any
  val: number | string | null
  label: string
}
defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <q-radio
    :model-value="modelValue"
    :val="val"
    :label="label"
    size="sm" dark color="white"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  />
</template>

<style lang="scss" scoped>

</style>
