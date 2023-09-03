<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { VerificationIdentify, verificationIdentifyDescriptions } from 'zjf-types'
import { Notify } from 'quasar'
import { requestVerification } from '../../../api/auth/verification/requestVerification'
import { uploadVerifyFile } from '../../../api/file/uploadVerifyFile'

interface Props {
  modelValue: boolean
}
defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'update:confirm'])

const identify = ref<{ label: string; id: VerificationIdentify | '' }>({ label: '', id: '' })

const files = ref<Array<File>>()
// const previewImgs = ref<Array<{ id: number; previewURL: any }>>([])
const myFileInput = ref(null)

const verifiInfo = reactive({
  name: '',
  school: '',
  college: '',
  number: '',
  idCard: '',
})
const attachmentsList = ref<Array<{ id: number;filename: string; previewURL: any }>>([])

const veriAccept = reactive({
  name: false,
  school: false,
  college: false,
  idCard: false,
  number: false,
})

const disable = computed(() => Object.values(veriAccept).includes(false) || !attachmentsList.value.length)

function transformedArray(): { label: string; id: string }[] {
  return Object.keys(VerificationIdentify).map(key => ({
    id: VerificationIdentify[key as keyof typeof VerificationIdentify],
    label: verificationIdentifyDescriptions[VerificationIdentify[key as keyof typeof VerificationIdentify]],
  }))
}
async function requestVerify() {
  let attachments = []
  attachments = attachmentsList.value.map(i => i.filename)
  const options = {
    ...verifiInfo,
    attachments,
    ...{ identify: identify.value.id },
  } as ICreateVerificationBodyDto

  // 请求认证
  const res = await requestVerification(options)
  if (res) {
    emits('update:confirm')
    Notify.create({
      message: '认证成功',
      type: 'success',
    })
  }
}
function pickImg() {
  if (myFileInput.value)
    myFileInput.value.$el.click()
}

async function fetchUploadFile(files?: File[]) {
  if (!files?.length)
    return

  attachmentsList.value = []

  for (const file of files) {
    const { name, lastModified } = file

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadVerifyFile(name, formData).catch((err) => {
      if (err.response.data.status === 200001) {
        Notify.create({
          message: err.response.data.message,
          type: 'danger',
        })
      }
    }) as string

    if (!res)
      return
    const reader = new FileReader()
    reader.onload = (e) => {
      attachmentsList.value.push({ filename: res, id: lastModified, previewURL: e.target?.result })
    }
    reader.readAsDataURL(file)
  }
}

function deletePreviewImg(fileId: number) {
  const indexToDelete = attachmentsList.value.findIndex(image => image.id === fileId)
  const deleteFile = files.value?.findIndex(item => item.lastModified === fileId)

  if (deleteFile !== -1) {
    attachmentsList.value.splice(indexToDelete, 1)
    files.value?.splice(deleteFile, 1)
  }
}

watch(files, (fileArr) => {
  if (!fileArr || !fileArr.length)
    return

  fetchUploadFile(fileArr)
})
</script>

<template>
  <ZDialog
    :model-value="modelValue" footer title="需要完善信息并且通过审核" :disable-confirm="disable"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @ok="requestVerify"
  >
    <div mb-2 mt-6>
      <span text-alert-error>*</span> <span font-500 text-grey-8> 学校名称</span>
    </div>
    <UserCodeInput
      v-model:user-code="verifiInfo.school"
      :rules="[(val) => val.length > 0 || '学校名称必填']"
      :dark="false" label="请输入学校名称"
      @update:accept="(val) => veriAccept.school = val"
    />

    <div mb-2>
      <span text-alert-error>*</span> <span font-500 text-grey-8> 所在学院</span>
    </div>
    <UserCodeInput
      v-model:user-code="verifiInfo.college"
      :rules="[(val) => val.length > 0 || '学院名称必填']"
      :dark="false" label="请输入学院名称"
      @update:accept="(val) => veriAccept.college = val"
    />

    <div mb-2>
      <span text-alert-error>*</span> <span font-500 text-grey-8> 身份证号码</span>
    </div>
    <UserCodeInput
      v-model:user-code="verifiInfo.idCard"
      :rules="[(val) => val.length === 18 || '身份证号码必须为18位']"
      :dark="false"
      label="请输入身份证号码"
      @update:accept="(val) => veriAccept.idCard = val"
    />

    <div mb-2>
      <span text-alert-error>*</span> <span font-500 text-grey-8> 学号/工号</span>
    </div>
    <UserCodeInput
      v-model:user-code="verifiInfo.number"
      :dark="false" label="请输入学号/工号"
      :rules="[(val) => val.length > 0 || '学号/工号必填']"
      @update:accept="(val) => veriAccept.number = val"
    />

    <div mb-2>
      <span text-alert-error>*</span> <span font-500 text-grey-8> 姓名</span>
    </div>
    <UserCodeInput
      v-model:user-code="verifiInfo.name"
      :rules="[(val) => val.length > 0 || '姓名必填']"
      :dark="false" label="请输入您的真实姓名"
      @update:accept="(val) => veriAccept.name = val"
    />

    <div mb-2>
      <span text-alert-error>*</span> <span font-500 text-grey-8>身份 </span>
    </div>

    <ZSelect v-model="identify" :options="transformedArray()" />
    <div mb-2 mt-6 flex="~ row justify-between items-center">
      <div> <span text-alert-error>*</span> <span font-500 text-grey-8>上传资料</span></div>

      <div class="q-gutter-md" style="max-width: 300px">
        <q-file
          ref="myFileInput"
          v-model="files"
          accept=".jpg, image/*"
          max-files="8"
          append multiple
          style="display:none"
          type="file"
          label="Standard"
          max-file-size="1048576"
        />
        <Btn transparent label="选择图片（最多8张）" @click="pickImg" />
      </div>
    </div>

    <div mt-3 text-grey-6>
      学生请上传学生证，教师及其它研究人员请上传校园卡或工作凭证，仅限图片文件，大小不超过2M
    </div>

    <div grid-cols-2 ml-4 mt-10 items-center gap-3>
      <q-img v-for="f in attachmentsList" :key="f.id" no-native-menu h-20 w-20 :src="f.previewURL" :alt="f.previewURL">
        <div
          class="absolute-top-right"
          h-2 w-2 cursor-pointer
          style="background-color: rgba(0, 0, 0, 0.30);"
          @click="deletePreviewImg(f.id)"
        >
          <div style="top:50%;left: 50%;transform: translate(-50%,-50%);" i-material-symbols:close-rounded absolute />
        </div>
      </q-img>
    </div>
  </ZDialog>
</template>

<style lang="">

</style>
