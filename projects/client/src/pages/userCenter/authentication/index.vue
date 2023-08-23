<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { CodeAction, VerificationIdentify, verificationIdentifyDescriptions } from 'zjf-types'
import type { ICreateVerificationBodyDto } from 'zjf-types'
import { Notify } from 'quasar'
import { useUser } from '../../../composables/useUser'

import { uploadVerifyFile } from '~/api/file/uploadVerifyFile'
import { requestVerification } from '~/api/auth/verification/requestVerification'
import { changeNickname } from '~/api/user/chnageNickname'
import { changeEmail } from '~/api/auth/user/changeEmail'
import { changePassword } from '~/api/user/changePassword'

const { useGetProfile, userInfo, getVerify, latestVerifiy } = useUser()

const showVeri = ref(false)
const files = ref<Array<File>>()
const myFileInput = ref(null)
const identify = ref<{ label: string; id: VerificationIdentify }>({ label: '', id: VerificationIdentify.TEACHER })

// if (!userInfo.value)
//   useGetProfile()

const baseInfoList = reactive([
  {
    label: '昵称',
    id: 'nickname',
    edit: '',
    caption: '可用于登录平台',
    inputVal: userInfo.value?.nickname || '',
  },
  {
    label: '邮箱',
    id: 'email',
    edit: '',
    caption: '可用于接受平台信息',
    smsCode: '',
    bizId: '',
    action: CodeAction.BIND_EMAIL,
    inputVal: userInfo.value?.email || '',
  },
  {
    label: '密码',
    id: 'password',
    edit: '',
    smsCode: '',
    bizId: '',
    caption: '设置密码已确保账户安全',
    action: CodeAction.CHANGE_PASSWORD,
    inputVal: '',
  },
])

const authInfoList = reactive([
  {
    label: '学校',
    id: 'school',
    disable: true,
    inputVal: latestVerifiy.value?.school,
  },
  {
    label: '学院',
    disable: true,
    inputVal: latestVerifiy.value?.college,
  },
  {
    label: '学号/工号',
    disable: true,
    inputVal: latestVerifiy.value?.number,
  },
  {
    label: '真实姓名',
    disable: true,
    inputVal: latestVerifiy.value?.name,
  }, {
    label: '身份证',
    disable: true,
    inputVal: latestVerifiy.value?.idCard,
  },
  {
    label: '用户类型',
    disable: true,
    inputVal: latestVerifiy.value?.identify,
  },
])

function transformedArray(): { label: string; id: string }[] {
  return Object.keys(VerificationIdentify).map(key => ({
    id: VerificationIdentify[key as keyof typeof VerificationIdentify],
    label: verificationIdentifyDescriptions[VerificationIdentify[key as keyof typeof VerificationIdentify]],
  }))
}

const verifiInfo = reactive<ICreateVerificationBodyDto>({
  name: '',
  identify: identify.value.id,
  attachments: [],
  school: '',
  college: '',
  number: '',
  idCard: '',
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

async function requestVerify() {
  await fetchUploadFile(files.value)
  // 请求认证
  const res = await requestVerification(verifiInfo)
  notify(res, '认证')
}

async function confirmEdit(id: string) {
  const obj = baseInfoList.find(i => i.id === id)

  if (!obj)
    return

  if (id === 'nickname') {
    const res = await changeNickname(obj.edit)
    notify(res, '修改')
  }
  if (id === 'email') {
    const res = await changeEmail(obj.edit, obj.bizId, obj.smsCode)
    notify(res, '修改')
  }
  if (id === 'password') {
    const res = await changePassword(obj.edit, userInfo.value?.email, obj.bizId, obj.smsCode)
    notify(res, '修改')
  }
}

function notify(res: any, message: string) {
  if (res) {
    Notify.create({
      message: `${message}成功`,
      type: 'sucesss',
    })
  }
  else {
    Notify.create({
      message: `${message}失败,请检查输入信息`,
      type: 'error',
    })
  }
}

// function change
onBeforeMount(async () => {
  await useGetProfile()
  await getVerify()
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
      <div flex="~ col gap-10">
        <ChangeInput
          v-for="b in baseInfoList"
          :id="b.id"
          :key="b.label"
          v-model:user-code="b.inputVal"
          v-model:edit="b.edit"
          v-model:smsCode="b.smsCode"
          :action="b.action"
          :captions="b.caption"
          class="col-grow"
          :label="b.label"
          @update:biz-id="(val) => b.bizId = val"
          @update:confirm="confirmEdit(b.id)"
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
          </div>
          <UserCodeInput
            v-model:user-code="a.inputVal"
            :dark="false"
            :disable="a.disable"
          />
        </div>
      </div>
    </div>

    <div flex="~ row" mt-10 w-full justify-center>
      <div v-if="userInfo && userInfo.verification">
        <VerifyStatus :status="latestVerifiy?.status" />
      </div>

      <div v-else flex="~ row gap-5">
        <VerifyStatus status="none" />
        <Btn label="前往认证" @click="showVeri = true" />
      </div>
    </div>

    <ZDialog v-model="showVeri" :confirm-event="requestVerify" footer title="需要完善信息并且通过审核">
      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8> 所在学院</span>
      </div>
      <UserCodeInput v-model:user-code="verifiInfo.college" :dark="false" label="请输入学院名称" />

      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8> 身份证号码</span>
      </div>
      <UserCodeInput v-model:user-code="verifiInfo.idCard" :dark="false" label="请输入身份证号码" />

      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8> 学号/工号</span>
      </div>
      <UserCodeInput v-model:user-code="verifiInfo.number" :dark="false" label="请输入学号/工号" />

      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8> 学校名称</span>
      </div>
      <UserCodeInput v-model:user-code="verifiInfo.school" :dark="false" label="请输入学校名称" />

      <div mb-2 mt-6>
        <span text-alert-error>*</span> <span font-500 text-grey-8> 姓名</span>
      </div>
      <UserCodeInput v-model:user-code="verifiInfo.name" :dark="false" label="请输入您的真实姓名" />

      <div mb-2 mt-6>
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
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
