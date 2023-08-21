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
  <div flex="~ row gap-2">
    <q-img v-if="!svg" style="width: 150px" :src="urlImg" />
    <div class="q-gutter-md" style="max-width: 300px">
      <q-file
        color="lime-11" bg-color="primary"
        :label="svg ? '上传svg' : '上传图片'"
        :accept="svg ? '.svg' : '.jpg, image/*'"
        filled
        dense
        borderless
        max-w-20
        :model-value="imgFile"
        @update:model-value="(val) => uploadFile(val)"
      />
    </div>
  </div>
</template>

<style lang="">

</style>
