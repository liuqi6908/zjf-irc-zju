<script setup lang="ts">
defineProps<Props>()
defineEmits(['update:userCode'])

interface Props {
  userCode: string
  userType?: 'phone' | 'username'
}

const isPhone = [
  val => (/^1[3456789]\d{9}$/.test(val)) || '请输入合法手机号',
]
</script>

<template>
  <q-input
    :model-value="userCode"
    input-class="rounded-8"
    outlined
    :rules="userType === 'phone' ? isPhone : []"
    @update:model-value="(v: string) => $emit('update:userCode', v)"
  />
</template>

<style lang="">

</style>
