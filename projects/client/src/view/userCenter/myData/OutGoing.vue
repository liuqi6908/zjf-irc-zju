<script lang="ts" setup>
import { Notify } from 'quasar'
import { putExportLg } from '~/api/exportLg/putExportLg'
import { putExportSm } from '~/api/exportSm/putExportSm'

interface FileInfoItem {
  remark: string
  dropzoneFile?: File
  size: number
  desc: string[]
}
type FileType = 'small' | 'big'

const toggle: Array<{ label: string; value: FileType }> = [
  { label: '小文件外发', value: 'small' },
  { label: '大文件外发', value: 'big' },
]
const model = ref<FileType>(toggle[0].value)
const editDialog = ref(false)
const loading = ref(false)

const outgoingInfo = reactive<Record<FileType, FileInfoItem>>({
  small: {
    remark: '',
    dropzoneFile: undefined,
    size: 100 * 1024,
    desc: [
      '（1）支持 100KB 及以内的文件，每日外发次数上限为5次；',
      '（2）禁止外发原始数据；禁止外发 .zip、.rar 等压缩文件；',
      '（3）无需审核，快速通过；',
      '（4）外发标准详见“智能云科研平台”的常见问题解答板块。',
    ],
  },
  big: {
    remark: '',
    dropzoneFile: undefined,
    size: 5 * 1024 * 1024,
    desc: [
      '（1）支持 5MB 及以内的文件外发，每日外发次数不限；',
      '（2）管理员将在1 - 2个工作日内，完成外发数据的审核；',
      '（3）禁止外发原始数据；',
      '（4）不符合外发标准的文件将被驳回，符合条件的文件将发送至您的邮箱；',
      '（5）支持.zip 、.rar 等文件的外发；',
      '（6）外发文件审核标准见“智能云科研平台”的常见问题解答板块。',
    ],
  },
})

/**
 * 拖拽文件
 * @param e
 */
function dropFiles(e: DragEvent) {
  const fileList = e.dataTransfer?.files
  addFile(fileList)
}

/**
 * 选择文件
 */
function selectedFiles() {
  const fileList = document?.querySelector('.drop-zone-file')?.files as FileList
  addFile(fileList)
}

/**
 * 添加文件
 * @param files
 */
function addFile(files?: FileList) {
  if (files && files.length) {
    const fileArr = Array.from(files)
    for (const file of fileArr) {
      const approve = checkFile(file, outgoingInfo[model.value].size)
      if (approve)
        outgoingInfo[model.value].dropzoneFile = file
    }
  }
  clearInputFiles()
}

/**
 * 检查文件
 * @param file
 * @param size
 */
function checkFile(file: File, size: number) {
  // 检查文件类型
  if (model.value === 'small' && isCompressedFile(file)) {
    Notify.create({
      message: '不允许的文件类型',
      type: 'danger',
    })
    return false
  }

  if (file.size > size) {
    Notify.create({
      message: '文件大小超出限制',
      type: 'danger',
    })
    return false
  }

  return true
}

/**
 * 是否为压缩文件
 * @param file
 */
function isCompressedFile(file: File): boolean {
  const type = file.type
  const suffix = file.name.split('.').pop()?.toLocaleLowerCase()
  const allowedTypes = ['zip', 'rar', '7z', 'tar', 'xz', 'gz', 'tgz', 'lzh', 'iso']
  for (const key of allowedTypes) {
    if (type.includes(key) || suffix?.includes(key))
      return true
  }
  return false
}

/**
 * 外发
 */
async function outConfirm() {
  loading.value = true
  const { dropzoneFile, remark } = outgoingInfo[model.value]
  if (!dropzoneFile)
    return
  try {
    let res, message
    if (model.value === 'big') {
      res = await putExportLg(dropzoneFile, remark)
      message = '外发成功，请等待管理员审核！'
    }
    else {
      res = await putExportSm(dropzoneFile, remark)
      message = '外发成功，请前往邮箱查看！'
    }
    if (res) {
      Notify.create({
        message,
        type: 'success',
      })
      outgoingInfo[model.value].dropzoneFile = undefined
    }
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

/**
 * 清除已选文件
 */
function clearInputFiles() {
  const el = document?.querySelector('.drop-zone-file')
  if (el)
    el.value = null
}
</script>

<template>
  <div>
    <!-- 加载中 -->
    <div v-if="loading" full flex-center absolute z-100 top-0 left-0 style="background: rgba(255, 255, 255, 0.6)">
      <q-spinner
        color="primary-1" size="5rem" :thickness="2" label-class="text-primary-1"
        label-style="font-size: 1.1em"
      />
    </div>
    <!-- 切换外发类型 -->
    <header full flex-center mb-6 mt-4>
      <q-btn-toggle
        v-model="model"
        no-caps unelevated spread rounded-0
        toggle-color="primary-1"
        toggle-text-color="grey-1"
        color="grey-2"
        text-color="grey-8"
        :options="toggle"
        size="16px" padding="6.3px 48px"
      />
    </header>
    <!-- 外发提示信息 -->
    <div flex="~ col items-center" w-full bg-grey-2 py-4>
      <div flex="~ col items-start" mb-4 text-grey-8 gap-2>
        <div v-for="(item, index) in outgoingInfo[model].desc" :key="index" v-text="item" />
      </div>
      <span text-alert-error>注：您的所有数据外发行为将被保留，用于平台行为审查，请严格遵守平台外发规则！</span>
    </div>
    <div
      mt-10 w-full px-4 mb-5 py-2 text="alert-error left"
      style="background: rgba(244, 67, 54, 0.08);white-space: normal"
    >
      您申请外发的文件，可能被误认为垃圾邮件。
      若您在【收件箱】中无法查找到该邮件，
      请前往【垃圾邮件】查看，或者您可以将 noreply@qiyandata.com 添加为可信任的电子邮箱
    </div>
    <!-- 外发内容 -->
    <div flex="~ col" w-full my-5>
      <div flex="~ row" mb-2 font-500 text-grey-8>
        备注信息
      </div>
      <UserCodeInput v-model:user-code="outgoingInfo[model].remark" w-full :dark="false" />
    </div>
    <div flex="~ row" mb-2 font-500 text-grey-8>
      选择文件<span text-grey-5 font-400>（将需要外发的文件，拖拽至此框内，或点击一下按钮上传文件）</span>
    </div>
    <DropZone @drop.prevent="dropFiles" @change="selectedFiles">
      <div v-if="outgoingInfo[model].dropzoneFile" mt-6 flex="~ row gap-2" text-grey-8>
        <div text-grey-5 relative i-material-symbols:note-outline top-0.5 />
        {{ outgoingInfo[model].dropzoneFile?.name }}
        <q-icon
          name="fas fa-close" size="7px"
          relative cursor-pointer top-1 bg-gray-4 text-white
          p-1 rounded="1/2" ml-4 hover:bg-grey-5 transition
          @click="outgoingInfo[model].dropzoneFile = undefined"
        />
      </div>
    </DropZone>

    <div flex="~ row justify-center" mt-10 w-full>
      <div flex h-12 gap-8>
        <Btn1 w-36 outline label="更改邮箱" @click="editDialog = true" />
        <Btn1 w-36 label="外发" :disable="!Boolean(outgoingInfo[model].dropzoneFile)" @click="outConfirm()" />
      </div>
    </div>

    <EmailEditDialog v-model:edit-dialog="editDialog" label="邮箱" />
  </div>
</template>

<style lang="scss" scoped>
.q-btn-toggle {
  :deep(.q-btn) {
    font-weight: 600;
  }
}
</style>
