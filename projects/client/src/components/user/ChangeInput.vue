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
    <div mb-4 flex="~ row items-center justify-between">
      <div>
        <span font-500 text-grey-8>
          {{ label }}
        </span>
        <span text-grey-6>({{ captions }})</span>
      </div>
    </div>

    <div flex="~ row gap-10">
      <UserCodeInput
        class="col-grow"
        :disable="true"
        :dark="false"
        :user-code="userCode"
        @update:user-code="(v) => $emit('update:userCode', v)"
      />
      <div>
        <Btn v-if="label !== '用户名'" outline label="修改" @click="editDialog = true" />
      </div>
    </div>

    <ZDialog v-model="editDialog" :title="`修改${label}`" :footer="true" @ok="() => $emit('update:confirm', id)">
      <div mb-3 text-grey-8>
        {{ label }}
      </div>

      <UserCodeInput
        :dark="false"
        :user-code="edit"
        @update:user-code="(v) => $emit('update:edit', v)"
      />

      <div v-if="action" mt-6>
        <div mb-3 text-grey-8>
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
