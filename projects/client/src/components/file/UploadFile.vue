<script setup lang="ts">
interface Props {
  modelValue: any
  label?: string
  acceptFile?: string
  multiple?: boolean
}
withDefaults(defineProps<Props>(), {
  acceptFile: '.jpg, image/*',
})
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
      :accept="acceptFile"
      max-files="8"
      append
      :multiple="multiple"
      style="display:none"
      type="file"
      label="Standard"
      max-file-size="1048576"
      @update:model-value="(val) => $emit('update:modelValue', val)"
    />
    <div @click="pickImg">
      <slot>
        <Btn transparent :label="label" />
      </slot>
    </div>
  </div>
</template>

<style lang="">

</style>
