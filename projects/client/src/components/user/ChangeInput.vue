<script setup lang="ts">
interface Props {
  modelValue: any
  isEdit?: boolean
  label?: string
  captions?: string
}
defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'update:isEdit'])
function edit(edit: boolean) {
  emits('update:isEdit', edit)
}
</script>

<template>
  <section>
    <div mb-4 flex="~ row items-center justify-between">
      <div>
        <span font-500 text-grey-8>
          {{ label }}
        </span>
        <span text-grey-6>{{ captions }}</span>
      </div>
      <Btn label="修改" @click="$emit('update:edit')" />
    </div>
    <UserCodeInput
      :dark="false"
      :disable="!isEdit"
      :user-code="modelValue"
      @update:user-code="(v) => $emit('update:modelValue', v)"
    />
  </section>
</template>

<style lang="">

</style>
