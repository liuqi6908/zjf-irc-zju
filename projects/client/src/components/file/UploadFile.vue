<script setup lang="ts">
import { Notify, QFile } from 'quasar'

interface Props {
  modelValue: any
  label?: string
  acceptFile?: string
  multiple?: boolean
  maxFileSize?: number
}
withDefaults(defineProps<Props>(), {
  acceptFile: '.jpg, image/*',
  maxFileSize: 2 * 1024 * 1024,
})
defineEmits(['update:modelValue'])

const myFileInput = ref<QFile>()
const files = ref<Array<File>>()

function pickImg() {
  myFileInput.value?.$el.click()
}

function onRejected(e: any[]) {
  if (e.length) {
    const { failedPropValidation } = e[0]
    if (failedPropValidation === 'accept') {
      Notify.create({
        type: 'danger',
        message: '不支持的文件类型',
      })
    }
    else if (failedPropValidation === 'max-file-size') {
      Notify.create({
        type: 'danger',
        message: '超出限定的文件大小',
      })
    }
  }
}
</script>

<template>
  <div class="q-gutter-md" style="max-width: 300px">
    <QFile
      ref="myFileInput"
      :model-value="files"
      :accept="acceptFile"
      max-files="8"
      append
      :multiple="multiple"
      style="display:none"
      type="file"
      label="Standard"
      :max-file-size="maxFileSize"
      @update:model-value="val => $emit('update:modelValue', val)"
      @rejected="onRejected"
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
