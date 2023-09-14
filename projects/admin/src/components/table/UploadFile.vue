<script lang="ts" setup>
import { getPublicFileUrl, putPublicFile } from '~/api/file/handlePublicFile'

interface Props {
  urlImg: string
  svg?: boolean
}
const props = defineProps<Props>()
const emits = defineEmits(['update:urlImg'])

const svgRef = ref<Element>()
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

watch(
  () => props.urlImg,
  () => {
    nextTick(() => {
      const el = svgRef.value?.firstElementChild
      if (el) {
        const width = el.scrollWidth
        el.style.transform = `scale(${152 / width})`
        el.style.transformOrigin = 'left top'
      }
    })
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div flex="~ col gap-2">
    <q-file
      color="lime-11" bg-color="primary"
      label-color="grey-1"
      :label="svg ? '上传svg' : '上传图片'"
      :accept="svg ? '.svg' : '.jpg, image/*'"
      standout dense
      class="w-38!"
      :model-value="imgFile"
      @update:model-value="(val) => uploadFile(val)"
    />
    <q-img v-if="!svg && urlImg" w-38 :src="urlImg" />
    <div v-else-if="svg && urlImg" ref="svgRef" w-38 max-h-40 v-html="urlImg" />
  </div>
</template>
