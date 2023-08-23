<script setup lang="ts">
interface Props {
  modelValue: any
  label: string
}
defineProps<Props>()
defineEmits(['update:modelValue'])

const myFileInput = ref(null)
const files = ref<Array<File>>()

function pickImg() {
  if (myFileInput.value)
    myFileInput.value.$el.click()
}
</script>

<template>
  <div class="q-gutter-md" style="max-width: 300px">
    <q-file
      ref="myFileInput"
      :model-value="files"
      accept=".jpg, image/*"
      max-files="8"
      append
      multiple style="display:none"
      type="file"
      label="Standard"
      max-file-size="1048576"
      @update:model-value="(val) => $emit('update:modelValue', val)"
    />
    <Btn transparent :label="label" @click="pickImg" />
  </div>
</template>

<style lang="">

</style>
