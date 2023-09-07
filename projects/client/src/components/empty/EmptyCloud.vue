<script setup lang="ts">
interface Props {
  label: string
  captions?: string
}
defineProps<Props>()
</script>

<template>
  <div flex="~ col" flex-center>
    <div h-60 w-60 flex-center rounded-9999 bg-grey-2>
      <svg width="146" height="138" viewBox="0 0 146 138" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="65.125" y="110.5" width="16" height="24" fill="#D4DDEA" />
        <rect x="38" y="127.5" width="70" height="10" fill="#D4DDEA" />
        <rect y="0.5" width="146" height="110" fill="#D4DDEA" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M52.1409 84.5004C52.14 84.5004 52.1391 84.5004 52.1383 84.5004C40.6171 84.5004 31.2773 75.1607 31.2773 63.6395C31.2773 52.7893 39.5609 43.8738 50.149 42.8722C53.3729 33.3456 62.3866 26.4883 73.0019 26.4883C83.6174 26.4883 92.6312 33.3458 95.8551 42.8727C106.441 43.8766 114.722 52.791 114.722 63.6395C114.722 75.1601 105.383 84.4995 93.8627 84.5004V84.51H52.1409V84.5004Z" fill="white" />
      </svg>
    </div>
    <div flex="~ col items-center" mt-6>
      <span text-4.5 text-grey-8>{{ label }}</span>
      <span text-grey-5>{{ captions }}</span>
    </div>
  </div>
</template>

<style>

</style>
