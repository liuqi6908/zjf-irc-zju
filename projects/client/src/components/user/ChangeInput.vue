<script setup lang="ts">
interface Props {
  id: string
  userCode: string
  edit: string
  smsCode: string
  bizId: string
  label?: string
  captions?: string
  action?: string
}
defineProps<Props>()
const emits = defineEmits(['update:userCode', 'update:edit', 'update:confirm', 'update:bizId'])
const { userInfo } = useUser()
const editDialog = ref(false)
</script>

<template>
  <section>
    <div mb2 flex="~ row items-center justify-between">
      <div text-3.5>
        <span font-600 text-grey-8>
          {{ label }}
        </span>
        <span text-grey-6>（{{ captions }}）</span>
      </div>
    </div>

    <div flex="~ row" gap10>
      <div
        flex="~ 1"
        h12 items-center border-1 border-gray-3 bg-gray-2 px3 py2
        text="4 gray-4 left"
      >
        {{ userCode }}
      </div>
      <div min-w-20>
        <Btn v-if="label !== '用户名'" outline label="修改" @click="editDialog = true" />
      </div>
    </div>

    <ZDialog v-model="editDialog" :title="`修改${label}`" :footer="true" @ok="() => $emit('update:confirm', id)">
      <div mb2 font-bold text-grey-8>
        {{ label }}
      </div>

      <UserCodeInput
        :dark="false"
        :user-code="edit"
        @update:user-code="(v) => $emit('update:edit', v)"
      />

      <div v-if="action" mt6>
        <div mb2 font-bold text-grey-8>
          邮箱验证
        </div>
        <SMSInput
          :email="id === 'email' ? edit : userInfo?.email"
          :action="action"
          :dark="false"
          :sms-code="smsCode"
          @update:sms-code="(val) => $emit('update:smsCode', val)"
          @update:biz-id="(val) => $emit('update:bizId', val)"
        />
      </div>
    </ZDialog>
  </section>
</template>

<style lang="">

</style>
