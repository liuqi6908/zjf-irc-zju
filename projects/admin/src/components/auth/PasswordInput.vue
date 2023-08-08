<script setup lang="ts">
const props = defineProps<Props>()
const emits = defineEmits(['update:password', 'update:accept'])

const isPwd = ref(true)
const inputRef = ref(null)

interface Props {
  password: string
  rules?: Array<any>
  reactiveRules?: boolean
}

watch(() => props.password, () => {
  if (inputRef.value) {
    const validate = inputRef.value?.validate(props.password)
    emits('update:accept', validate)
  }
})
</script>

<template>
  <q-input
    ref="inputRef"
    :reactive-rules="reactiveRules"
    :rules="rules"
    :model-value="password"
    outlined
    dense
    :type="isPwd ? 'password' : 'text'"
    label="请输入密码"
    @update:model-value="(v: string) => $emit('update:password', v)"
  >
    <template #append>
      <div

        :class="isPwd ? 'i-mingcute:eye-close-line' : 'i-mingcute:eye-2-line' "
        cursor-pointer text-grey-5
        @click="isPwd = !isPwd"
      />
    </template>
  </q-input>
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
