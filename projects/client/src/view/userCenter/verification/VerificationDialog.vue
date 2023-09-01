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
const myFileInput = ref(null)

const verifiInfo = reactive({
  name: '',
  attachments: [],
  school: '',
  college: '',
  number: '',
  idCard: '',
})

const veriAccept = reactive({
  name: false,
  school: false,
  college: false,
  idCard: false,
  number: false,
})

const disable = computed(() => Object.values(veriAccept).includes(false))

function transformedArray(): { label: string; id: string }[] {
  return Object.keys(VerificationIdentify).map(key => ({
    id: VerificationIdentify[key as keyof typeof VerificationIdentify],
    label: verificationIdentifyDescriptions[VerificationIdentify[key as keyof typeof VerificationIdentify]],
  }))
}
async function requestVerify() {
  await fetchUploadFile(files.value)

  const options = {
    ...verifiInfo,
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
  for (const file of files) {
    const { name } = file

    const formData = new FormData()
    formData.append('file', file)

    const res = await uploadVerifyFile(name, formData)
    if (!res)
      return
    verifiInfo.attachments.push(res)
  }
}
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
    <div v-for="f in files" :key="f.__key" ml-4 flex flex-row items-center>
      <div i-mingcute:file-line text-grey-5 />
      <div ml-1 text-grey-8>
        {{ f.name }}
      </div>
    </div>
  </ZDialog>
</template>

<style lang="">

</style>
