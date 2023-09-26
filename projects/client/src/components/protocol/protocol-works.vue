<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()
defineEmits<{
  'update:modelValue': [v: boolean]
}>()

const WorksDoc = defineAsyncComponent(() => import('./works-doc.vue'))

const dialog = ref(false)
</script>

<template>
  <div flex="~" items-start gap-1>
    <q-checkbox
      :model-value="modelValue"
      dense class="round style-1"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div>
      <span>我已阅读并同意</span>
      <span
        text-primary-1 cursor-pointer hover:underline
        @click="dialog = true"
      >《「智能云科研平台」用户作品上传协议》</span>
    </div>
    <ZDialog
      v-model="dialog"
      :wrapper-style="{
        width: '50rem',
        maxWidth: '50rem',
        height: '95vh',
      }"
      scroll
      title="「智能云科研平台」用户作品上传协议"
    >
      <WorksDoc />
    </ZDialog>
  </div>
</template>
