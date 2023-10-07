<script lang="ts" setup>
import { getPublicFileUrl, putPublicFile } from '~/api/file/handlePublicFile'

interface Props {
  urlImg: string
  svg?: boolean
}
defineProps<Props>()
const emits = defineEmits(['update:urlImg'])

const imgFile = ref(null)

async function uploadFile(file: File) {
  const fromData = new FormData()
  fromData.append('file', file)
  const res = await putPublicFile('cms', file.name, fromData)
  if (res && file.name && fromData) {
    const url = await getPublicFileUrl('cms', file.name) || ''
    emits('update:urlImg', url)
  }
}
</script>

<template>
  <div flex="~ col gap-2">
    <Upload
      color="primary"
      :label="svg ? '上传svg' : '上传图片'"
      :accept="svg ? '.svg' : '.jpg, image/*'"
      :model-value="imgFile"
      @update:model-value="(val) => uploadFile(val)"
    />
    <q-img v-if="!svg && urlImg" w-30 :src="urlImg" />
    <div v-else-if="svg && urlImg" class="preview-svg" w-20 max-h-40 m-auto flex="~" v-html="urlImg" />
  </div>
</template>

<style lang="scss" scoped>
.preview-svg {
  > :deep(svg) {
    height: auto !important;
  }
}
</style>
