<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()
defineEmits<{
  'update:modelValue': [v: boolean]
}>()

const PrivacyDoc = defineAsyncComponent(() => import('./privacy-doc.vue'))
const UserAgreementDoc = defineAsyncComponent(() => import('./user-agreement-doc.vue'))

const showPrivacyDialog = ref(false)
const showUserAgreementDialog = ref(false)
</script>

<template>
  <div flex="~" items-start gap-1>
    <q-checkbox
      :model-value="modelValue"
      dense class="round style-1"
      @update:model-value="$emit('update:modelValue', $event)"
    />
    <div>
      <span>我已阅读并同意</span>
      <span
        text-primary-1 cursor-pointer hover:underline
        @click="showPrivacyDialog = true"
      >《「智能云科研平台」隐私政策》</span>
      <span>、</span>
      <span
        text-primary-1 cursor-pointer hover:underline
        @click="showUserAgreementDialog = true"
      >《「智能云科研平台」用户使用协议》</span>
    </div>
    <ZDialog
      v-model="showPrivacyDialog"
      :wrapper-style="{
        width: '50rem',
        maxWidth: '50rem',
        height: '95vh',
      }"
      scroll
      title="「智能云科研平台」隐私政策"
    >
      <PrivacyDoc />
    </ZDialog>
    <ZDialog
      v-model="showUserAgreementDialog"
      :wrapper-style="{
        width: '50rem',
        maxWidth: '50rem',
        height: '95vh',
      }"
      scroll
      title="「智能云科研平台」用户使用协议"
    >
      <UserAgreementDoc />
    </ZDialog>
  </div>
</template>
