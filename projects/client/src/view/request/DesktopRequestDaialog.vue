<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useUser } from '../../composables/useUser'
import { getDesktopRequestFileUrl, putDesktopRequest } from '../../api/file/putDesktopRequest'
import { desktopRequest } from '../../api/desktop/desktopRequest'

import Zdialog from '../../components/dialog/Zdialog.vue'
import ZSelect from '../../components/select/ZSelect.vue'
import UploadFile from '../../components/file/UploadFile.vue'

defineProps<Props>()

defineEmits(['update:modelValue'])

const router = useRouter()
const { userInfo } = useUser()

const options = [
  { label: '6个月', id: 180 },
  { label: '12个月', id: 360 },
  { label: '长期', id: 999 },
]

const select = ref(options[0])
const files = ref<File[]>([])
const file = ref<File>()
const attachments = ref<Array<string>>([])
const read = ref(false)

interface Props {
  modelValue: boolean
}

async function confirm() {
  if (!files.value || !files.value.length)
    return
  for (const file of files.value) {
    const res = await putDesktopRequest(file.name, file)
    if (res)
      attachments.value.push(getDesktopRequestFileUrl(userInfo.value.id, file.name))
  }
  const requestRes = await desktopRequest(select.value.id, attachments.value)
  if (requestRes) {
    Notify.create({
      message: '申请成功',
      type: 'success',
    })
  }
}

watch(file, (newFile) => {
  if (newFile)
    files.value.push(newFile)
})
</script>

<template>
  <Zdialog
    title="申请使用"
    caption="(申请结果前往“用户中心”查看)"
    :confirm-event="confirm"
    :disable-confirm="!read"
    :model-value="modelValue"
    footer
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <div flex="~ col">
      <span mb-4 text-4 font-600 text-grey-8>云桌面使用时长</span>
      <ZSelect v-model="select" :options="options" />
    </div>

    <div my-6 flex="~ col">
      <div flex="~ row justify-between items-center">
        <span text-4 font-600 text-grey-8>研究计划/其他材料</span>
        <UploadFile v-model="file" label="提交文件" />
      </div>

      <div v-for="(file, index) in files" :key="index" flex="~ row" text-grey-5>
        <div i-mingcute:file-line text-grey-5 />{{ file.name }}
      </div>
    </div>

    <div flex="~ row">
      <q-checkbox
        v-model="read"
      />
      <div>
        <span text-grey-5>我已阅读并同意</span>
        <span cursor-pointer text-primary-1 @click="() => router.replace('/protocol/private')">
          《「社科大数据平台」隐私政策》
        </span>
        <span cursor-pointer text-primary-1 @click="() => router.replace('/protocol/use')">
          《「社科大数据平台」用户使用协议》
        </span>
      </div>
    </div>
  </Zdialog>
</template>
