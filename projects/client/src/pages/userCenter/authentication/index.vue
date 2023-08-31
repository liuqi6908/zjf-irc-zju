<script lang="ts" setup>
import { reactive, ref } from 'vue'

import { CodeAction, VerificationStatus } from 'zjf-types'
import { Notify } from 'quasar'
import { useUser } from '../../../composables/useUser'

import VerificationDialog from '~/view/userCenter/verification/VerificationDialog.vue'

import { changeNickname } from '~/api/user/chnageNickname'
import { changeEmail } from '~/api/auth/user/changeEmail'
import { changePassword } from '~/api/user/changePassword'
import { cancelVerification } from '~/api/auth/verification/cancelVerification'

const { useGetProfile, userInfo, getVerify, latestVerifiy } = useUser()

const showVeri = ref(false)

// if (!userInfo.value)
//   useGetProfile()

const baseInfoList = reactive([
  {
    label: '用户名',
    id: 'account',
    edit: '',
    caption: '可用于登录平台',
    inputVal: '',
  },
  {
    label: '邮箱',
    id: 'email',
    edit: '',
    caption: '可用于接受平台信息',
    smsCode: '',
    bizId: '',
    action: CodeAction.BIND_EMAIL,
    inputVal: '',
  },
  {
    label: '密码',
    id: 'password',
    edit: '',
    smsCode: '',
    bizId: '',
    caption: '设置密码已确保账户安全',
    action: CodeAction.CHANGE_PASSWORD,
    inputVal: '*********',
  },
])

const authInfoList = reactive([
  {
    label: '学校',
    id: 'school',
    disable: true,
    inputVal: '',
  },
  {
    label: '学院',
    id: 'college',
    disable: true,
    inputVal: '',
  },
  {
    label: '学号/工号',
    id: 'number',
    disable: true,
    inputVal: '',
  },
  {
    label: '真实姓名',
    id: 'name',
    disable: true,
    inputVal: '',
  }, {
    label: '身份证',
    id: 'idCard',
    disable: true,
    inputVal: '',
  },
  {
    label: '用户类型',
    id: 'identify',
    disable: true,
    inputVal: '',
  },
])

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

async function cancel(verificationId: string) {
  const res = await cancelVerification(verificationId)
}

// function change
onBeforeMount(async () => {
  await useGetProfile()
  await getVerify()

  for (const key in userInfo.value) {
    const user = baseInfoList.find(i => i.id === key)
    if (user && userInfo.value[key])
      user.inputVal = userInfo.value[key]
  }

  // 认证
  for (const key in latestVerifiy.value) {
    const obj = authInfoList.find(i => i.id === key)
    if (latestVerifiy.value[key] && obj)
      obj.inputVal = latestVerifiy.value[key]
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

        <Btn
          v-if="latestVerifiy?.status === VerificationStatus.CANCELLED"
          label="前往认证"
          @click="showVeri = true"
        />
        <Btn
          v-if="latestVerifiy?.status === VerificationStatus.PENDING"
          label="取消认证"
          @click="cancel(userInfo.verification.id)"
        />

        <span v-if="latestVerifiy?.status === VerificationStatus.REJECTED">
          驳回理由：{{ latestVerifiy.rejectReason }}
        </span>
      </div>

      <div v-else flex="~ row gap-5">
        <VerifyStatus status="none" />
        <Btn label="前往认证" @click="showVeri = true" />
      </div>
    </div>

    <VerificationDialog v-model="showVeri" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
