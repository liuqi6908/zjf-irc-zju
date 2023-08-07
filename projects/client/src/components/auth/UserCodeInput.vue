<script setup lang="ts">
const props = defineProps<Props>()
const emits = defineEmits(['update:userCode', 'update:accept'])

interface Props {
  userCode: string
  accept?: boolean
  rule?: Array<any>
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
    outlined dense
    :rules="rule"
    @update:model-value="(v) => $emit('update:userCode', v)"
  />
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
