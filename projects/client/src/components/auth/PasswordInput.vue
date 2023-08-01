<script setup lang="ts">
defineProps<Props>()
defineEmits(['update:password'])
const isPwd = ref(true)

interface Props {
  password: string
  /** 是否开启合法校验 */
  verify?: boolean
}
</script>

<template>
  <q-input
    :model-value="password"
    outlined
    :type="isPwd ? 'password' : 'text'"
    label="请输入密码"
    @update:model-value="(v: string) => $emit('update:password', v)"
  >
    <template #append>
      <div
        :class="isPwd ? 'i-mingcute:eye-close-fill' : 'i-mingcute:eye-2-fill' "
        cursor-pointer
        @click="isPwd = !isPwd"
      />
    </template>
  </q-input>
</template>

<style lang="">

</style>
