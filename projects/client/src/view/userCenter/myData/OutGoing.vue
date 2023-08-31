<script lang="ts" setup>
import { Notify } from 'quasar'
import { putExportLg } from '~/api/exportLg/putExportLg'
import { putExportSm } from '~/api/exportSm/putExportSm'

// const dropzoneFile = ref<File[]>([])
type FileType = 'small' | 'big'
const toggle: Array < { label: string; value: FileType } > = [
  { label: '小文件外发', value: 'small' },
  { label: '大文件外发', value: 'big' },
]
const model = ref<FileType>(toggle[0].value)
const editDialog = ref(false)
interface FileInfoItem {
  name: string
  remark: string
  dropzoneFile: File
  size: number
}

const outgoingInfo = reactive<Record<FileType, FileInfoItem>>({
  small: {
    name: '',
    remark: '',
    dropzoneFile: null,
    size: 100 * 1024,
  },
  big: {
    name: '',
    remark: '',
    dropzoneFile: null,
    size: 5 * 1024 * 1024,
  },
})

function dropFiles(e: DragEvent) {
  const fileList = e.dataTransfer?.files
  if (fileList && fileList.length) {
    const fileArr = Array.from(fileList)
    for (const file of fileArr) {
      const approve = checkFile(file, outgoingInfo[model.value].size)
      if (approve)
        outgoingInfo[model.value].dropzoneFile = file
    }
  }
}

function selectedFiles() {
  const fileList = document.querySelector('.drop-zone-file')?.files as FileList

  if (fileList && fileList.length) {
    const fileArr = Array.from(fileList)
    for (const file of fileArr) {
      const approve = checkFile(file, outgoingInfo[model.value].size)
      if (approve)
        outgoingInfo[model.value].dropzoneFile = file
    }
  }
}

function checkFile(file: File, size: number) {
  // 检查文件类型
  const allowedTypes = ['application/zip', 'application/rar']
  if (allowedTypes.includes(file.type)) {
    alert('不允许的文件类型')
    return false
  }

  const maxSize = size
  if (file.size > maxSize) {
    alert('文件大小超过限制（100KB）')
    return false
  }

  return true
}

async function outConfirm() {
  if (model.value === 'big') {
    const { dropzoneFile, remark } = outgoingInfo.big
    const res = await putExportLg(dropzoneFile, remark)
    if (res) {
      Notify.create({
        message: '大文件申请外发成功',
        type: 'success',
      })
    }
  }
  else if (model.value === 'small') {
    const { dropzoneFile, remark } = outgoingInfo.small
    const res = await putExportSm(dropzoneFile, remark)
    if (res) {
      Notify.create({
        message: '小文件外发成功',
        type: 'success',
      })
    }
  }
}
</script>

<template>
  <div w-full class="col-grow" p-7 flex="~ col items-start">
    <header mb-6 mt-4 full flex-center>
      <q-btn-toggle
        v-model="model"
        no-caps unelevated spread rounded-0
        toggle-color="primary-1"
        color="white"
        text-color="black"
        :options="toggle"
      />
    </header>

    <div v-if="model === 'small'" flex="~ col items-center" w-full bg-grey-2 py-4>
      <div flex="~ col items-start" mb-4 text-grey-8>
        <span mb-2>
          （1）支持 100KB 及以内的文件，每日外发次数上限为5次；
        </span>
        <span mb-2>（2）禁止外发原始数据；禁止外发 .zip、.rar 等压缩文件；</span>
        <span mb-2>
          （3）无需审核，快速通过。
        </span>
        <span>（4）外发标准详见“智能云科研平台”的常见问题解答板块。</span>
      </div>

      <span text-alert-error>注：您的所有数据外发行为将被保留，用于平台行为审查，请严格遵守平台外发规则！</span>
    </div>

    <div v-if="model === 'big'" flex="~ col items-center" w-full bg-grey-2 py-4>
      <div flex="~ col items-start" mb-4 text-grey-8>
        <span mb-2>
          （1）支持 5MB 及以内的文件外发，每日外发次数不限；
        </span>
        <span mb-2>（2）管理员将在1-2个工作日内，完成外发数据的审核；</span>
        <span mb-2>
          （3）禁止外发原始数据；
        </span>
        <span mb-2>（4）不符合外发标准的文件将被驳回，符合条件的文件将发送至您的邮箱；</span>
        <span mb-2>（5）支持 .zip 、.rar 等文件的外发；</span>
        <span>（6）外发文件审核标准见“智能云科研平台”的常见问题解答板块。</span>
      </div>

      <span text-alert-error>注：您的所有数据外发行为将被保留，用于平台行为审查，请严格遵守平台外发规则！</span>
    </div>

    <div

      mb-5 mt-10 w-full px-4 py-2 text-alert-error
      style="background: rgba(244, 67, 54, 0.08);white-space: normal"
    >
      您申请外发的文件，可能被误认为垃圾邮件。
      若您在【收件箱】中无法查找到该邮件，
      请前往【垃圾邮件】查看，或者您可以将 no-reply@qiyandata.com 添加为可信任的电子邮箱
    </div>

    <!-- <div flex="~ col" my-6 w-full>
      <div flex="~ row" mb-2 font-500 text-grey-8>
        真实姓名
      </div>
      <UserCodeInput v-model:user-code="outgoingInfo[model].name" w-full :dark="false" />
    </div> -->

    <div flex="~ col" my-5 w-full>
      <div flex="~ row" mb-2 font-500 text-grey-8>
        备注信息
      </div>
      <UserCodeInput v-model:user-code="outgoingInfo[model].remark" w-full :dark="false" />
    </div>

    <div flex="~ row" mb-2 font-500 text-grey-8>
      选择文件<span text-grey-5>（将需要外发的文件，拖拽至此框内，或点击一下按钮上传文件）</span>
    </div>

    <DropZone @drop.prevent="dropFiles" @change="selectedFiles">
      <div flex="~ col gap-2">
        <span v-if="outgoingInfo[model].dropzoneFile" flex="~ row gap-2" text-grey-8>
          <div i-material-symbols:note-outline text-grey-5 />  {{ outgoingInfo[model].dropzoneFile?.name }}
        </span>
      </div>
    </DropZone>

    <div flex="~ row justify-center" mt-10 w-full>
      <div flex="~ row gap-5">
        <btn label="更改邮箱" w-30 outline @click="editDialog = true" />
        <btn w-30 label="外发" @click="outConfirm()" />
      </div>
    </div>

    <EmailEditDialog v-model:edit-dialog="editDialog" label="邮箱" />
  </div>
</template>

<style lang="scss" scoped>

</style>
