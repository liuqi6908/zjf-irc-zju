<script lang="ts" setup>
import { reactive, ref } from 'vue'

const inputVal = ref('disable')

const baseInfoList = reactive([
  {
    label: '昵称',
    disable: true,
    caption: '',
    inputVal: '',
  },
  {
    label: '邮箱',
    disable: true,
    inputVal: '',
  },
])

const authInfoList = reactive([
  {
    label: '学校',
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
    label: '学校',
    disable: true,
    caption: '',
    inputVal: '',
  },
  {
    label: '学院',
    disable: true,
    inputVal: '',
  }, {
    label: '学校',
    disable: true,
    caption: '',
    inputVal: '',
  },
  {
    label: '学院',
    disable: true,
    inputVal: '',
  },
])
</script>

<template>
  <div flex flex-col class="col-grow">
    <!-- 基础信息 -->
    <div flex="~ col" class="baseInfo" pb-10>
      <header flex="~ row justify-start" mb-6 text-5 font-600 text-grey-8>
        基础信息
      </header>

      <div flex="~ row gap-10">
        <ChangeInput
          v-for="b in baseInfoList"
          :key="b.label"
          v-model="b.inputVal"
          class="col-grow"
          label="邮箱"
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
      已认证/未认证
      <Btn label="认证" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: userCenter
</route>
