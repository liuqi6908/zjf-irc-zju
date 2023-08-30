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
      <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="128" cy="128" r="128" fill="#F5F7FA" />
        <rect x="45" y="60" width="166" height="136" fill="white" />
        <rect x="53" y="68" width="150" height="120" fill="#D4DDEA" />
        <rect x="85.0449" y="151.805" width="24" height="28" fill="white" fill-opacity="0.5" />
        <rect x="85.0449" y="151.805" width="24" height="6" fill="white" />
        <rect x="115.566" y="137.805" width="24" height="42" fill="white" fill-opacity="0.5" />
        <rect x="115.566" y="137.805" width="24" height="6" fill="white" />
        <rect x="146.089" y="121.805" width="24" height="58" fill="white" fill-opacity="0.5" />
        <rect x="146.089" y="121.805" width="24" height="6" fill="white" />
        <path d="M85.8926 124.087L112.958 97.0214L133.175 117.239L168.719 81.6953" stroke="white" stroke-opacity="0.5" stroke-width="6" />
        <circle cx="86.0645" cy="124.195" r="7" fill="#AFBDD1" />
        <circle cx="113.064" cy="98.1953" r="7" fill="#AFBDD1" />
        <circle cx="134.064" cy="117.195" r="7" fill="#AFBDD1" />
        <circle cx="169.064" cy="82.1953" r="7" fill="#AFBDD1" />
      </svg>
    </div>
    <div flex="~ col items-center" mt-5>
      <span text-4.5 text-grey-8>{{ label }}</span>
      <span text-grey-5>{{ captions }}</span>
    </div>
  </div>
</template>

<style>

</style>
