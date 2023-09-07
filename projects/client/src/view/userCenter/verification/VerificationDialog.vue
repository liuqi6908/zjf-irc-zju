<script lang="ts" setup>
import { computed, defineAsyncComponent, reactive, ref } from 'vue'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { VerificationIdentify, verificationIdentifyDescriptions } from 'zjf-types'
import { Notify, QFile } from 'quasar'
import { requestVerification } from '../../../api/auth/verification/requestVerification'

import { uploadVerifyFile } from '../../../api/file/uploadVerifyFile'

defineProps<Props>()

const emits = defineEmits(['update:modelValue', 'update:confirm'])

const VerificationInput = defineAsyncComponent(() => import('./VerificationInput.vue'))

interface Props {
  modelValue: boolean
}
const identify = ref<{ label: string; id: VerificationIdentify | '' }>({ label: '', id: '' })

const files = ref<Array<File>>([])
// const previewImgs = ref<Array<{ id: number; previewURL: any }>>([])
const myFileInput = ref<typeof QFile>()

const verifyInfo = reactive({
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

const disable = computed(() =>
  Object.values(veriAccept).includes(false)
  || !attachmentsList.value.length
  || !identify.value.id,
)

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
    ...verifyInfo,
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
    :wrapper-style="{ height: '80vh' }"
    class="max-w-300px"
    :model-value="modelValue" footer scroll
    title="需要完善信息并且通过审核"
    :disable-confirm="disable"
    @update:model-value="(val) => $emit('update:modelValue', val)"
    @ok="requestVerify"
  >
    <div flex="~ col" gap1>
      <section class="form-item">
        <span text-grey-8>学校名称</span>
        <VerificationInput
          v-model="verifyInfo.school"
          v-model:errored="veriAccept.school"
          label="请输入学校名称"
          :rules="[(val: string) => val.length > 0 || '学校名称必填']"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 所在学院</span>
        <VerificationInput
          v-model="verifyInfo.college"
          v-model:errored="veriAccept.college"
          label="请输入学院名称"
          :rules="[(val: string) => val.length > 0 || '学院名称必填']"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 身份证号码</span>
        <VerificationInput
          v-model="verifyInfo.idCard"
          v-model:errored="veriAccept.idCard"
          :rules="[(val: string) => val.length === 18 || '身份证号码必须为18位']"
          label="请输入身份证号码"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 学号/工号</span>
        <VerificationInput
          v-model="verifyInfo.number"
          v-model:errored="veriAccept.number"
          :rules="[(val: string) => val.length > 0 || '学号/工号必填']"
          label="请输入学号/工号"
        />
      </section>

      <section class="form-item">
        <span text-grey-8> 姓名</span>
        <VerificationInput
          v-model="verifyInfo.name"
          v-model:errored="veriAccept.name"
          :rules="[(val: string) => val.length > 0 || '姓名必填']"
          label="请输入您的真实姓名"
        />
      </section>

      <section class="form-item" mb5>
        <span text-grey-8>身份 </span>
        <ZSelect
          v-model="identify"
          label="请选择您的身份"
          :options="transformedArray()"
        />
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
            <q-btn flat bg="primary-1/10" text-primary-1 @click="pickImg">
              <div flex="~ row" items-center gap2>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 12.1667H13L9.875 8L7.375 11.3333L5.5 8.83333L3 12.1667ZM0.5 15.5V0.5H15.5V15.5H0.5ZM2.16667 13.8333H13.8333V2.16667H2.16667V13.8333ZM5.08333 6.33333C5.43056 6.33333 5.72583 6.21167 5.96917 5.96833C6.2125 5.725 6.33389 5.43 6.33333 5.08333C6.33333 4.73611 6.21167 4.44083 5.96833 4.1975C5.725 3.95417 5.43 3.83278 5.08333 3.83333C4.73611 3.83333 4.44083 3.955 4.1975 4.19833C3.95417 4.44167 3.83278 4.73667 3.83333 5.08333C3.83333 5.43056 3.955 5.72583 4.19833 5.96917C4.44167 6.2125 4.73667 6.33389 5.08333 6.33333Z" fill="#025CB9" />
                </svg>
                <span text-nowrap>选择图片（最多8张）</span>
              </div>
            </q-btn>
          </div>
        </div>

        <div text-grey-6>
          学生请上传学生证，教师及其它研究人员请上传校园卡或工作凭证，仅限图片文件，大小不超过2M
        </div>

        <div grid grid-cols-8 items-center gap1>
          <div
            v-for="(f, index) in attachmentsList"
            :key="f.name"
            :style="{
              backgroundImage: `url('${f.previewURL}')`,
              aspectRatio: 1,
            }"
            relative min-h-5 bg-cover
          >
            <div
              class="absolute-top-right"
              h-5 w-5 cursor-pointer
              bg="black/30"
              @click="deletePreviewImg(index)"
            >
              <div
                left="1/2" top="1/2"
                translate-x="-1/2"
                translate-y="-1/2"

                i-material-symbols:close-rounded absolute text-white
              />
            </div>
          </div>
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
