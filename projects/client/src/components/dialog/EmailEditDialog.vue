<script lang="ts" setup>
import { Notify } from 'quasar'
import { CodeAction } from 'zjf-types'
import { changeEmail } from '~/api/user/changeEmail'

interface Props {
  editDialog: boolean
  label: string
}
defineProps<Props>()
defineEmits(['update:editDialog'])

const editInfo = reactive({
  edit: '',
  bizId: '',
  smsCode: '',
  email: '',
})

async function confirmEdit() {
  const res = await changeEmail(editInfo.edit, editInfo.bizId, editInfo.smsCode)
  if (res) {
    Notify.create({
      message: '修改成功',
      type: 'success',
    })
  }
}
</script>

<template>
  <ZDialog
    :model-value="editDialog" :title="`修改${label}`" :footer="true"
    :confirm-event="confirmEdit"
    @update:model-value="(val) => $emit('update:editDialog', val)"
  >
    <div mb-3 text-grey-8>
      {{ label }}
    </div>

    <UserCodeInput

      :dark="false"
      :user-code="editInfo.edit"
      @update:user-code="(v) => $emit('update:edit', v)"
    />

    <div mb-3 mt-6 text-grey-8>
      邮箱验证
    </div>
    <SMSInput
      v-model:sms-code="editInfo.smsCode"
      :email="editInfo.email"
      :action="CodeAction.BIND_EMAIL"
      :dark="false"
      @update:biz-id="(val) => editInfo.bizId = val"
    />
  </zdialog>
</template>

<style lang="">

</style>
