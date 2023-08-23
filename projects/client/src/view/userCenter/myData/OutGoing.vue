<script lang="ts" setup>
import OutGoingHeader from './OutGoingHeader.vue'

// const dropzoneFiles = ref<File[]>([])
const outgoingInfo = reactive<{
  name: string
  remark: string
  dropzoneFiles: File[]
}>({
  name: '',
  remark: '',
  dropzoneFiles: [],
})

function dropFiles(e: DragEvent) {
  const fileList = e.dataTransfer?.files
  if (fileList && fileList.length) {
    const fileArr = Array.from(fileList)
    for (const file of fileArr)
      outgoingInfo.dropzoneFiles?.push(file)
  }
}

function selectedFiles() {
  const fileList = document.querySelector('.drop-zone-file')?.files as FileList

  if (fileList && fileList.length) {
    const fileArr = Array.from(fileList)
    for (const file of fileArr)
      outgoingInfo.dropzoneFiles?.push(file)
  }
}
</script>

<template>
  <div class="col-grow" p-7 flex="~ col items-start">
    <OutGoingHeader />
    <!-- <div text-alert-error my-5 indent-0 pa-2 style="background: rgba(244, 67, 54, 0.08); white-space: normal">
      您申请外发的文件，可能被误认为垃圾邮件。若您在【收件箱】中无法查找到该邮件，请前往【垃圾邮件】查看，或者您可以将 no-reply@qiyandata.com 添加为可信任的电子邮箱
    </div> -->

    <div flex="~ col" my-5 w-full>
      <div flex="~ row" mb-2 font-500 text-grey-8>
        真实姓名
      </div>
      <UserCodeInput v-model:user-code="outgoingInfo.name" w-full :dark="false" />
    </div>

    <div flex="~ col" my-5 w-full>
      <div flex="~ row" mb-2 font-500 text-grey-8>
        备注信息
      </div>
      <UserCodeInput v-model:user-code="outgoingInfo.remark" w-full :dark="false" />
    </div>

    <div flex="~ row" mb-2 font-500 text-grey-8>
      选择文件<span text-grey-5>（将需要外发的文件，拖拽至此框内，或点击一下按钮上传文件）</span>
    </div>

    <DropZone @drop.prevent="dropFiles" @change="selectedFiles">
      <div flex="~ col gap-2">
        <span v-for="(file, index) in outgoingInfo.dropzoneFiles" :key="index" flex="~ row gap-2" text-grey-8>
          <div i-material-symbols:note-outline text-grey-5 />  {{ file.name }}
        </span>
      </div>
    </DropZone>

    <div flex="~ row justify-center" mt-10 w-full>
      <div flex="~ row gap-5">
        <btn label="更改邮箱" w-30 outline />
        <btn w-30 label="外发" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
