<script setup lang="ts">
const props = defineProps<Props>()
const emits = defineEmits(['update:userCode', 'update:accept'])

interface Props {
  userCode: string
  accept?: boolean
  rule?: Array
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
    :model-value="userCode"
    input-class="rounded-8"
    outlined
    :rules="rule"
    @input="setModelValue(value)"
    @update:model-value="(v: string) => $emit('update:userCode', v)"
  />
</template>

<style lang="">

</style>
