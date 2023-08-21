<script lang="ts" setup>
import * as WangEditor from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { editorConfig } from './richConfig'

interface Props {
  modelValue: string
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue'])

const mode = ref('simple')

const { Editor, Toolbar } = WangEditor

const editorRef = shallowRef()
const toolbarConfig = {}

onMounted(() => {
  setTimeout(() => {
    emits('update:modelValue', props.modelValue)
  }, 1500)
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null)
    return

  editor.destroy()
})

function handleCreated(editor: any) {
  editorRef.value = editor // 记录 editor 实例，重要！
}
</script>

<template>
  <div>
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid #ccc;width: 500px;"
    />
    <Editor
      :model-value="modelValue"
      style="height: 400px; overflow-y: hidden;width: 500px;"
      :default-config="editorConfig"
      :mode="mode"
      @update:model-value="(val:any) => $emit('update:modelValue', val)"
      @onCreated="handleCreated"
    />
  </div>
</template>

<style>

</style>
