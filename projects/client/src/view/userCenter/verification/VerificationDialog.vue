<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { VerificationIdentify, verificationIdentifyDescriptions } from 'zjf-types'
import { Notify, QFile } from 'quasar'
import { requestVerification } from '../../../api/auth/verification/requestVerification'

import { uploadVerifyFile } from '../../../api/file/uploadVerifyFile'

interface Props {
  modelValue: boolean
}
defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'update:confirm'])

const identify = ref<{ label: string; id: VerificationIdentify | '' }>({ label: '', id: '' })

const files = ref<Array<File>>([])
// const previewImgs = ref<Array<{ id: number; previewURL: any }>>([])
const myFileInput = ref<typeof QFile>()

const verifiInfo = reactive({
  name: '',
  school: '',
  college: '',
  number: '',
  idCard: '',
})
const attachmentsList = ref<Array<{ name: string; filename: string; previewURL: any }>>([])

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
  if (files.value.length >= 8) {
    Notify.create({
      message: '最多上传 8 张图片',
      type: 'danger',
    })
  }
  else {
    myFileInput.value?.$el.click()
  }
}

async function fetchUploadFile() {
  if (!files.value.length)
    return

  for (const file of files.value) {
    const { name } = file
    if (attachmentsList.value.find(v => v.name === name))
      continue

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

    if (res) {
      const reader = new FileReader()
      reader.onload = (e) => {
        attachmentsList.value.push({ name, filename: res, previewURL: e.target?.result })
      }
      reader.readAsDataURL(file)
    }
  }
}

function deletePreviewImg(index: number) {
  attachmentsList.value.splice(index, 1)
  files.value?.splice(index, 1)
}

watch(
  files,
  () => {
    fetchUploadFile()
  })
</script>

<template>
  <ZDialog
    :model-value="modelValue" footer title="需要完善信息并且通过审核" :disable-confirm="disable"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @ok="requestVerify"
  >
    <div flex="~ col" gap1>
      <section class="form-item">
        <span text-grey-8> 学校名称</span>
        <UserCodeInput
          v-model:user-code="verifiInfo.school"
          :rules="[(val: string) => val.length > 0 || '学校名称必填']"
          :dark="false" label="请输入学校名称"
          @update:accept="(val) => veriAccept.school = val"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 所在学院</span>
        <UserCodeInput
          v-model:user-code="verifiInfo.college"
          :rules="[(val: string) => val.length > 0 || '学院名称必填']"
          :dark="false" label="请输入学院名称"
          @update:accept="(val) => veriAccept.college = val"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 身份证号码</span>
        <UserCodeInput
          v-model:user-code="verifiInfo.idCard"
          :rules="[(val: string) => val.length === 18 || '身份证号码必须为18位']"
          :dark="false"
          label="请输入身份证号码"
          @update:accept="(val) => veriAccept.idCard = val"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 学号/工号</span>
        <UserCodeInput
          v-model:user-code="verifiInfo.number"
          :dark="false" label="请输入学号/工号"
          :rules="[(val: string) => val.length > 0 || '学号/工号必填']"
          @update:accept="(val) => veriAccept.number = val"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 姓名</span>
        <UserCodeInput
          v-model:user-code="verifiInfo.name"
          :rules="[(val: string) => val.length > 0 || '姓名必填']"
          :dark="false" label="请输入您的真实姓名"
          @update:accept="(val) => veriAccept.name = val"
        />
      </section>

      <section class="form-item" mb5>
        <span text-grey-8>身份 </span>
        <ZSelect v-model="identify" :options="transformedArray()" />
      </section>

      <section class="form-item">
        <div flex="~ row justify-between items-center">
          <span class="label" font-500 text-grey-8>上传资料</span>
          <div class="q-gutter-md" style="max-width: 300px">
            <QFile
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

        <div flex="~ wrap" grid-cols-2 ml-4 items-center gap-3>
          <q-img v-for="(f, index) in attachmentsList" :key="index" no-native-menu h-20 w-20 :src="f.previewURL" :alt="f.previewURL">
            <div
              class="absolute-top-right"
              h-2 w-2 cursor-pointer
              style="background-color: rgba(0, 0, 0, 0.30);"
              @click="deletePreviewImg(index)"
            >
              <div style="top:50%;left: 50%;transform: translate(-50%,-50%);" i-material-symbols:close-rounded absolute />
            </div>
          </q-img>
        </div>
      </section>
    </div>
  </ZDialog>
</template>

<style lang="sass" scoped>
.form-item
  display: flex
  flex-direction: column
  gap: 8px

  & > span,
  & span.label
    position: relative
    font-weight: 500
    &::before
      content: "*"
      color: #F44336
</style>
