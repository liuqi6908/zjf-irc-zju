<script lang="ts" setup>
import * as WangEditor from '@wangeditor/editor-for-vue'
import { editorConfig, toolbarConfig } from './richConfig'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue'])

const { Editor, Toolbar } = WangEditor
const editorRef = shallowRef()
const mode = ref('simple')

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

// 记录 editor 实例，重要！
function handleCreated(editor: any) {
  editorRef.value = editor
}
</script>

<template>
  <div flex="~ col" border="1px solid grey-3" rounded-2 overflow-hidden>
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      style="border-bottom: 1px solid #ccc;"
    />
    <Editor
      :model-value="modelValue"
      :default-config="editorConfig"
      :mode="mode" overflow-hidden
      class="h-100!"
      @update:model-value="(val:any) => $emit('update:modelValue', val)"
      @onCreated="handleCreated"
    />
  </div>
</template>

<style scoped>
.w-e-full-screen-container {
  z-index: 10000;
}
</style>
