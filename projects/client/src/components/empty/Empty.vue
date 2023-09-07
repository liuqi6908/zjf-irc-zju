<script setup lang="ts">
interface Props {
  label: string
  captions?: string
}
defineProps<Props>()
</script>

<template>
  <div flex="~ col" flex-center>
    <div flex-center bg-grey-2 h-60 w-60 rounded-9999>
      <svg xmlns="http://www.w3.org/2000/svg" width="148" height="132" viewBox="0 0 148 132" fill="none">
        <path d="M0.078125 131.49V15.3965H147.675V131.49H0.078125Z" fill="#A6B1C2" />
        <path d="M9.25977 5.47101L132.299 0.509766V107.673H9.25977V5.47101Z" fill="white" />
        <path d="M0.078125 131.489V19.6133H50.6828L55.644 29.7838H147.675V131.489H0.078125Z" fill="#6E7686" fill-opacity="0.4" />
        <path d="M0.078125 131.489V26.5586H45.7215L50.6828 36.7291H147.675V131.489H0.078125Z" fill="#D4DDEA" />
        <rect x="16.4512" y="66.498" width="38.2016" height="7.44186" fill="white" fill-opacity="0.5" />
        <rect x="16.4512" y="85.8457" width="63.0078" height="7.44186" fill="white" fill-opacity="0.5" />
      </svg>
    </div>
    <div flex="~ col items-center" mt-5>
      <span text-grey-8 text-4.5>{{ label }}</span>
      <span text-grey-5>{{ captions }}</span>
    </div>
  </div>
</template>

<style>

</style>
