<script setup lang="ts">
import { Notify, QFile } from 'quasar'

interface Props {
  modelValue: any
  label?: string
  color?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  size?: string
}
withDefaults(defineProps<Props>(), {
  color: 'primary',
  multiple: false,
  maxFiles: 1,
})
defineEmits(['update:modelValue'])

const myFileInput = ref<QFile>()

function clickFileInput() {
  myFileInput.value?.$el.click()
}

function onRejected(val: any) {
  Notify.create({
    type: 'danger',
    message: '不支持的文件类型',
  })
}
</script>

<template>
  <div>
    <QFile
      ref="myFileInput"
      :model-value="modelValue"
      :accept="accept"
      :max-files="maxFiles"
      append
      :multiple="multiple"
      style="display: none;"
      @update:model-value="val => $emit('update:modelValue', val)"
      @rejected="onRejected"
    />
    <div @click="clickFileInput">
      <slot>
        <QBtn :color="color" :label="label" w-full :size="size" />
      </slot>
    </div>
  </div>
</template>
