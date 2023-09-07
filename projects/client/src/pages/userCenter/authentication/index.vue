<script lang="ts" setup>
import { reactive, ref } from 'vue'

import type { IDesktop, IQueryConfig } from 'zjf-types'
import { CodeAction, PAGINATION_SIZE_MAX, VerificationStatus } from 'zjf-types'
import { Notify } from 'quasar'
import { useUser } from '../../../composables/useUser'

import VerificationDialog from '~/view/userCenter/verification/VerificationDialog.vue'

import { changeNickname } from '~/api/user/chnageNickname'
import { changeEmail } from '~/api/auth/user/changeEmail'
import { changePassword } from '~/api/user/changePassword'
import { cancelVerification } from '~/api/auth/verification/cancelVerification'
import { desktopQueryList } from '~/api/desktop/desktopsList'

const { useGetProfile, userInfo, getVerify, latestVerifiy } = useUser()

const showVeri = ref(false)
const desktop = ref(false)

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

const baseOpts: IQueryConfig<IDesktop> = {
  pagination: {
    page: 0,
    pageSize: PAGINATION_SIZE_MAX,
  },
  filters: [],
  sort: [],
  relations: {
    user: { desktop: true },
  },
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

async function cancel(verificationId: string) {
  const res = await cancelVerification(verificationId)
  if (res)
    checkoutVerifiy()
}

async function checkoutVerifiy() {
  await useGetProfile()
  await getVerify()

  for (const key in userInfo.value) {
    const user = baseInfoList.find(i => i.id === key)
    if (user && userInfo.value[key])
      user.inputVal = userInfo.value[key]
  }

  if (latestVerifiy.value?.status !== VerificationStatus.APPROVED)
    return

  // 认证
  for (const key in latestVerifiy.value) {
    const obj = authInfoList.find(i => i.id === key)
    if (latestVerifiy.value[key] && obj)
      obj.inputVal = latestVerifiy.value[key]
  }
}

// function change
onBeforeMount(async () => {
  await checkoutVerifiy().finally(async () => {
    const options = { ...baseOpts }
    if (userInfo.value) {
      options.filters = [
        {
          field: 'user.id',
          type: '=',
          value: userInfo.value.id,
        },
      ]
      const res = await desktopQueryList(options)
      if (res.data && res.data.length)
        desktop.value = res.data[0].user.desktop && !res.data[0].user.desktop.disable

      desktop.value = false
    }
  })
})
</script>

<template>
  <div flex flex-col class="col-grow">
    <!-- 基础信息 -->
    <div flex="~ col" class="baseInfo">
      <header flex="~ row justify-start" mb-6 text-5 font-600 text-grey-8>
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
          @update:biz-id="(val) => b.bizId = val"
          @update:confirm="confirmEdit(b.id)"
        />
      </div>
    </div>

    <div my16 h1px w-full bg-gray-3 />

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
            h12 items-center border-1 border-gray-3 bg-gray-2 px3 py2
            text="4 gray-4 left"
          >
            {{ a.inputVal }}
          </div>
        </div>
      </div>
    </div>

    <div flex="~ row" mt-10 w-full justify-center>
      <div flex="~ row items-center gap-5" max-w-sm>
        <div
          v-if="latestVerifiy?.status !== VerificationStatus.REJECTED"
          h-full max-w-sm flex="~ row items-center gap-5"
        >
          <VerifyStatus
            :status="latestVerifiy?.status"
          />
          <Btn
            v-if="latestVerifiy?.status === VerificationStatus.CANCELLED || !latestVerifiy"
            label="前往认证"
            @click="showVeri = true"
          >
            <template #icon>
              <div i-material-symbols:arrow-forward ml-2 />
            </template>
          </Btn>

          <Btn
            v-else-if="latestVerifiy?.status === VerificationStatus.PENDING && desktop"
            label="取消认证"
            @click="cancel(latestVerifiy.id)"
          >
            <template #icon>
              <div i-material-symbols:close-rounded ml-2 />
            </template>
          </Btn>
        </div>

        <div v-else flex="~ col items-center" h-full>
          <div flex="~ row items-center gap-5" h-full max-w-sm>
            <VerifyStatus :status="latestVerifiy?.status" />
            <Btn
              label="前往认证"
              @click="showVeri = true"
            >
              <template #icon>
                <div i-material-symbols:arrow-forward ml-2 />
              </template>
            </Btn>
          </div>

          <div v-if="latestVerifiy?.status === VerificationStatus.REJECTED" flex="~ col" mt-5 w-full bg-grey-2 p-4>
            <div flex="~ row" mb-2 font-500 text-grey-8>
              驳回理由
            </div>
            <div flex="~ row" indent-0 text-grey-8>
              {{ latestVerifiy.rejectReason }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <VerificationDialog v-model="showVeri" @update:confirm="checkoutVerifiy()" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
