<script lang="ts" setup>
import { CodeAction, VerificationStatus } from 'zjf-types'
import type { IUser, IVerificationHistory } from 'zjf-types'
import { hideSensitiveInfo } from 'zjf-utils'
import { Notify } from 'quasar'

import VerificationDialog from '~/view/userCenter/verification/VerificationDialog.vue'

import { changeEmail } from '~/api/auth/user/changeEmail'
import { changePassword } from '~/api/user/changePassword'
import { cancelVerification } from '~/api/auth/verification/cancelVerification'

const { useGetProfile, userInfo, getVerify, latestVerifiy } = useUser()

const showVeri = ref(false)

const baseInfoList = reactive([
  {
    label: '用户名',
    id: 'account',
    caption: '可用于登录平台',
    inputVal: '',
  },
  {
    label: '邮箱',
    id: 'email',
    caption: '可用于接收平台信息',
    inputVal: '',
    edit: '',
    smsCode: '',
    bizId: '',
    action: CodeAction.BIND_EMAIL,
  },
  {
    label: '密码',
    id: 'password',
    caption: '设置密码以确保账户安全',
    inputVal: '*********',
    edit: '',
    smsCode: '',
    bizId: '',
    action: CodeAction.CHANGE_PASSWORD,
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

/**
 * 修改基本信息
 * @param id
 */
async function confirmEdit(id: string) {
  const obj = baseInfoList.find(v => v.id === id)

  if (!obj || !obj.edit || !obj.smsCode)
    return

  try {
    let res
    if (id === 'email')
      res = await changeEmail(obj.edit, obj.bizId, obj.smsCode)
    else if (id === 'password' && userInfo.value?.email)
      res = await changePassword(userInfo.value?.email, obj.edit, obj.bizId, obj.smsCode)
    if (res) {
      Notify.create({
        message: '修改成功',
        type: 'success',
      })
    }
  }
  catch (_) {}
}

/**
 * 取消认证
 */
async function cancel(id: string) {
  const res = await cancelVerification(id)
  if (res)
    checkoutVerify()
}

/**
 * 重新获取用户信息
 */
async function checkoutVerify() {
  await useGetProfile()
  await getVerify()

  for (const key in userInfo.value) {
    const obj = baseInfoList.find(i => i.id === key)
    const value = userInfo.value[key as keyof IUser]
    if (obj && typeof value === 'string') {
      if (key === 'email')
        obj.inputVal = hideSensitiveInfo(value) || ''
      else
        obj.inputVal = value
    }
  }

  if (latestVerifiy.value?.status !== VerificationStatus.APPROVED)
    return

  // 认证
  for (const key in latestVerifiy.value) {
    const obj = authInfoList.find(i => i.id === key)
    const value = latestVerifiy.value[key as keyof IVerificationHistory]
    if (obj && typeof value === 'string') {
      if (key === 'idCard')
        obj.inputVal = hideSensitiveInfo(value) || ''
      else
        obj.inputVal = value
    }
  }
}

onBeforeMount(() => {
  checkoutVerify()
})
</script>

<template>
  <div flex flex-col class="col-grow">
    <!-- 基础信息 -->
    <div flex="~ col" class="baseInfo">
      <header flex="~ row justify-start" text-5 font-600 text-grey-8 mb-6>
        基础信息
      </header>
      <div flex="~ col" gap8>
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
          :biz-id="b.bizId"
          @update:sms-code="(val) => b.smsCode = val"
          @update:biz-id="(val) => b.bizId = val"
          @update:confirm="confirmEdit(b.id)"
        />
      </div>
    </div>
    <!-- 分割线 -->
    <div w-full my-16 h-1px bg-gray-3 />
    <!-- 认证信息 -->
    <div class="col-grow authInfo">
      <header flex="~ row justify-start" mb-6 text-5 font-600 text-grey-8>
        认证信息
      </header>
      <div grid gap-10 lg:grid-cols-2 xl:grid-cols-3>
        <div v-for="a in authInfoList" :key="a.label" class="col-grow">
          <div mb2 flex="~ row items-center justify-between">
            <span font-500 text-gray-8>
              {{ a.label }}
            </span>
          </div>
          <div
            flex="~ 1"
            h12 items-center py2 border-1 border-gray-3 bg-gray-2 px3
            text="4 gray-4 left"
          >
            {{ a.inputVal }}
          </div>
        </div>
      </div>
    </div>
    <!-- 用户状态 -->
    <div flex-center w-full mt-20>
      <!-- 已拒绝 -->
      <div v-if="latestVerifiy?.status === VerificationStatus.REJECTED" flex="~ col items-center" w-full>
        <div flex="~ row" justify-center items-center gap-8>
          <VerifyStatus :status="latestVerifiy?.status" />
          <Btn1
            label="前往认证" icon w-53
            @click="showVeri = true"
          />
        </div>
        <div flex="~ col" mt-6 w-full bg-grey-2 p-4 text="base grey-8 left">
          <div mb-2 font-600>
            驳回理由
          </div>
          <div break-all v-text="latestVerifiy?.rejectReason" />
        </div>
      </div>
      <!-- 其他状态 -->
      <div v-else flex="~ row" justify-center items-center gap-8 w-full>
        <VerifyStatus :status="latestVerifiy?.status" />
        <Btn1
          v-if="latestVerifiy?.status === VerificationStatus.CANCELLED || !latestVerifiy"
          label="前往认证" icon w-53
          @click="showVeri = true"
        />
        <Btn1
          v-else-if="latestVerifiy?.status === VerificationStatus.PENDING"
          w-53
          @click="cancel(latestVerifiy.id)"
        >
          取消认证
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" ml-3>
            <path d="M6.4 15L10 11.4L13.6 15L15 13.6L11.4 10L15 6.4L13.6 5L10 8.6L6.4 5L5 6.4L8.6 10L5 13.6L6.4 15ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88333 18.6867 3.825 17.9743 2.925 17.075C2.025 16.175 1.31267 15.1167 0.788 13.9C0.263333 12.6833 0.000666667 11.3833 0 10C0 8.61667 0.262667 7.31667 0.788 6.1C1.31333 4.88333 2.02567 3.825 2.925 2.925C3.825 2.025 4.88333 1.31267 6.1 0.788C7.31667 0.263333 8.61667 0.000666667 10 0C11.3833 0 12.6833 0.262667 13.9 0.788C15.1167 1.31333 16.175 2.02567 17.075 2.925C17.975 3.825 18.6877 4.88333 19.213 6.1C19.7383 7.31667 20.0007 8.61667 20 10C20 11.3833 19.7373 12.6833 19.212 13.9C18.6867 15.1167 17.9743 16.175 17.075 17.075C16.175 17.975 15.1167 18.6877 13.9 19.213C12.6833 19.7383 11.3833 20.0007 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="white" />
          </svg>
        </Btn1>
      </div>
    </div>
    <!-- 认证弹窗 -->
    <VerificationDialog v-model="showVeri" @update:confirm="checkoutVerify()" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
