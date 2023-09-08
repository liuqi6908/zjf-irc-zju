<script setup lang="ts">
interface Props {
  label: string
  captions?: string
}
defineProps<Props>()
</script>

<template>
  <div flex="~ col" flex-center>
    <div h-60 w-60 flex-center bg-grey-2 rounded-9999>
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="128" r="128" fill="#F5F7FA" />
        <rect x="120.125" y="174.5" width="16" height="24" fill="#D4DDEA" />
        <rect x="93" y="191.5" width="70" height="10" fill="#D4DDEA" />
        <rect x="55" y="64.5" width="146" height="110" fill="#D4DDEA" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M107.141 148.5C107.14 148.5 107.139 148.5 107.138 148.5C95.6171 148.5 86.2773 139.161 86.2773 127.64C86.2773 116.789 94.5609 107.874 105.149 106.872C108.373 97.3456 117.387 90.4883 128.002 90.4883C138.617 90.4883 147.631 97.3458 150.855 106.873C161.441 107.877 169.722 116.791 169.722 127.64C169.722 139.16 160.383 148.499 148.863 148.5V148.51H107.141V148.5Z" fill="white" />
        <circle cx="169" cy="152" r="23" fill="white" fill-opacity="0.5" stroke="#A6B1C2" stroke-width="10" />
        <rect x="189.688" y="165.617" width="24" height="10" transform="rotate(45 189.688 165.617)" fill="#A6B1C2" />
      </svg>
    </div>
    <div flex="~ col items-center" mt-6>
      <span text-grey-8 text-4.5>{{ label }}</span>
      <span text-grey-5>{{ captions }}</span>
    </div>
  </div>
</template>

<style>

</style>
