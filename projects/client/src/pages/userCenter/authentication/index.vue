<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { VerificationIdentify, verificationIdentifyDescriptions } from 'zjf-types'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { Notify } from 'quasar'
import { useUser } from '../../../composables/useUser'

import { uploadVerifyFile } from '~/api/file/uploadVerifyFile'
import { requestVerification } from '~/api/auth/verification/requestVerification'

const { useGetProfile, userInfo } = useUser()

const showVeri = ref(false)
const files = ref<Array<File>>()
const myFileInput = ref(null)

// if (!userInfo.value)
//   useGetProfile()

const baseInfoList = reactive([
  {
    label: '昵称',
    disable: true,
    id: 'nickname',
    caption: '',
    inputVal: userInfo.value && userInfo.value.nickname,
  },
  {
    label: '邮箱',
    disable: true,
    id: 'email',
    inputVal: userInfo.value && userInfo.value.email,
  },
])

const authInfoList = reactive([
  {
    label: '学校',
    id: 'school',
    disable: true,
    caption: '',
    inputVal: '',
  },
  {
    label: '学院',
    disable: true,
    inputVal: '',
  },
  {
    label: '学号/工号',
    disable: true,
    caption: '',
    inputVal: '',
  },
  {
    label: '真实姓名',
    disable: true,
    inputVal: '',
  }, {
    label: '身份证',
    disable: true,
    caption: '',
    inputVal: '',
  },
  {
    label: '用户类型',
    disable: true,
    inputVal: '',
  },
])

function transformedArray(): { name: string; label: string }[] {
  return Object.keys(VerificationIdentify).map(key => ({
    name: VerificationIdentify[key as keyof typeof VerificationIdentify],
    label: verificationIdentifyDescriptions[VerificationIdentify[key as keyof typeof VerificationIdentify]],
  }))
}

const verifiInfo = reactive<ICreateVerificationBodyDto>({
  name: '',
  identify: VerificationIdentify.TEACHER,
  attachments: [],
})

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

async function confirm() {
  await fetchUploadFile(files.value)

  const paramse = {
    name: verifiInfo.name,
    identify: verifiInfo.identify.id,
    attachments: verifiInfo.attachments,
  }
  // 请求认证
  const res = await requestVerification(paramse)
}

function onRejected(rejectedEntries: Array<any>) {
  rejectedEntries.forEach((reject) => {
    Notify.create({
      type: 'negative',
      message: `${reject.failedPropValidation}`,
    })
  })
}

onMounted(async () => {
  if (!userInfo.value) {
    await useGetProfile()
    baseInfoList.forEach((item) => {
      if (userInfo.value[item.id])
        item.inputVal = userInfo.value[item.id]
    })
  }
})
</script>

<template>
  <div flex flex-col class="col-grow">
    <!-- 基础信息 -->
    <div flex="~ col" class="baseInfo" pb-10>
      <header flex="~ row justify-start" mb-6 text-5 font-600 text-grey-8>
        基础信息
      </header>

      <!-- TODO:修改基本信息的交互 -->
      <div flex="~ row gap-10">
        <ChangeInput
          v-for="b in baseInfoList"
          :key="b.label"
          v-model="b.inputVal"
          class="col-grow"
          :label="b.label"
          :is-edit="b.disable"
          @update:is-edit="(val) => b.disable = val"
        />
      </div>
    </div>

    <!-- 认证信息 -->
    <div class="col-grow authInfo" border-t-1 pt-10>
      <header flex="~ row justify-start" mb-6 text-5 font-600 text-grey-8>
        认证信息
      </header>

      <div grid gap-10 lg:grid-cols-2 xl:grid-cols-3>
        <div v-for="a in authInfoList" :key="a.label" class="col-grow">
          <div mb-4 flex="~ row items-center justify-between">
            <span font-500 text-grey-8>
              {{ a.label }}
            </span>
            <span text-grey-6>{{ a.caption }}</span>
          </div>
          <UserCodeInput
            :disable="a.disable"
            :user-code="a.inputVal"
          />
        </div>
      </div>
    </div>

    <div>
      <div v-if="userInfo && userInfo.verification">
        已认证
      </div>
      <Btn v-else label="认证" @click="showVeri = true" />
    </div>

    <ZDialog v-model="showVeri" :confirm-event="confirm" footer title="需要完善信息并且通过审核">
      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8> 姓名</span>
      </div>
      <UserCodeInput v-model:user-code="verifiInfo.name" label="请输入您的真实姓名" />

      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8>身份 </span>
      </div>
      <ZSelect v-model="verifiInfo.identify" :options="transformedArray()" />
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
            @rejected="onRejected"
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
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
