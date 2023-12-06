<script lang="ts" setup>
import type { Node } from '~/composables/database'
import { fileToFormData } from 'zjf-utils'
import { Notify } from 'quasar'
import { getIntroduceUrl, getIntroduceFile, uploadIntroduceFile } from '~/api/file'

interface Props {
  id: string
}

const { id } = defineProps<Props>()
const { rootData, loading } = useDatabase()

const database = ref<Node[]>((rootData.value || [])[0]?.children || [])
const file = ref<File>()
const fileList = ref<string[]>([])

onMounted(async () => {
  loading.value = true
  for (const item of database.value) {
    const { nameEN } = item
    try {
      const { status } = await getIntroduceFile(id, nameEN)
      if (status === 200)
        fileList.value.push(nameEN)
    }
    catch (_) {}
  }
  loading.value = false
})

/**
 * 上传数据库介绍
 * @param file
 * @param name
 */
async function uploadIntroduce(file: File, name: string) {
  const formData = fileToFormData(file)
  const res = await uploadIntroduceFile(id, name, formData)
  if (res) {
    Notify.create({
      type: 'success',
      message: '上传成功',
    })
    fileList.value.push(name)
  }
}
</script>

<template>
  <div flex="~ col gap-4">
    <div text-xl font-600 mb-2>
      数据库介绍
    </div>
    <div v-if="!database?.length" text-alert-error>
      编辑数据库介绍前请先上传中间表
    </div>

    <div
      v-for="item in database"
      :key="item.id"
      flex="~ row items-center gap-4"
    >
      <div v-text="item.nameZH" />
      <div font-600 ml-auto>文件名:</div>
      <div>{{ fileList.includes(item.nameEN) ? `${item.nameEN}.docx` : '暂未上传文件' }}</div>
      <Upload
        label="上传数据库介绍"
        accept=".docx"
        :model-value="file"
        @update:model-value="val => uploadIntroduce(val, item.nameEN)"
      />
      <q-btn
        color="teal"
        :disable="!fileList.includes(item.nameEN)"
        label="下载数据库介绍"
        :href="getIntroduceUrl(id, item.nameEN)"
      />
    </div>
  </div>
</template>
