<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Notify } from 'quasar'
import { putDesktopRequest } from '../../api/file/putDesktopRequest'
import { desktopRequest } from '../../api/desktop/desktopRequest'

import ZDialog from '../../components/dialog/ZDialog.vue'
import ZSelect from '../../components/select/ZSelect.vue'
import UploadFile from '../../components/file/UploadFile.vue'

defineProps<Props>()
const $emit = defineEmits(['update:modelValue', 'callback'])

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
  const requestRes = await desktopRequest(select.value.id, attachments.value)
  if (requestRes) {
    Notify.create({
      message: '申请成功',
      type: 'success',
    })
    $emit('callback')
  }
}

watch(file, async (newFile) => {
  if (newFile) {
    const name = await putDesktopRequest(newFile.name, newFile)
    if (name) {
      attachments.value.push(name)
      files.value.push(newFile)
    }
    else {
      Notify.create({
        message: '文件上传失败',
        type: 'danger',
      })
    }
  }
})

/**
 * 移除文件
 * @param index
 */
function removeFile(index: number) {
  files.value.splice(index, 1)
  attachments.value.splice(index, 1)
}
</script>

<template>
  <ZDialog
    title="申请使用"
    caption="(申请结果前往“用户中心”查看)"
    :disable-confirm="!read || !files.length"
    :model-value="modelValue"
    footer
    @ok="confirm"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <div flex="~ col">
      <span mb-4 text-4 font-600 text-grey-8>云桌面使用时长</span>
      <ZSelect v-model="select" :options="options" />
    </div>

    <div my-6 flex="~ col">
      <div flex="~ row justify-between items-center" mb-2>
        <span text-4 font-600 text-grey-8>研究计划/其他材料</span>
        <UploadFile v-model="file" label="提交文件" />
      </div>

      <div v-for="(item, index) in files" :key="index" flex="~ row" text-grey-5 hover:bg-gray-100 items-center justify-between class="file-item">
        <div>
          <q-icon name="far fa-file" mr-1 />{{ item.name }}
        </div>
        <q-icon class="remove" name="fas fa-close" relative top-1px cursor-pointer hidden @click="removeFile(index)" />
      </div>
    </div>

    <div flex="~ row">
      <q-checkbox
        v-model="read"
      />
      <div>
        <span text-grey-5>我已阅读并同意</span>
        <RouterLink cursor-pointer text-primary-1 :to="{ path: '/protocol/private' }">
          《「社科大数据平台」隐私政策》
        </RouterLink>
        <RouterLink cursor-pointer text-primary-1 :to="{ path: '/protocol/use' }">
          《「社科大数据平台」用户使用协议》
        </RouterLink>
      </div>
    </div>
  </ZDialog>
</template>

<style lang="scss" scoped>
.file-item {
  &:hover {
    .remove {
      display: inline-block;
    }
  }
}
</style>
