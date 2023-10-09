<script setup lang="ts">
interface Props {
  nickname?: string
  avatarUrl?: string
  size?: number
}

withDefaults(defineProps<Props>(), {
  size: 40,
})

defineEmits(['update:route'])

function subStr(name: string) {
  if (!name)
    return ''
  return Array.from(name)[0]
}

function getImageUrl(url: string) {
  return new URL(`${url}`, import.meta.url).href
}
</script>

<template>
  <div cursor-pointer select-none>
    <div
      :style="{ width: `${size}px`, height: `${size}px` }"
      flex-center border-size-1.5 b-primary-1 rounded-full text-primary-1
    >
      <div
        v-if="avatarUrl" overflow-hidden
        :style="{ width: `${size}px`, height: `${size}px`, background: `${getImageUrl(avatarUrl)} cover` }"
      />
      <span v-else-if="nickname" class="show-first-char-only" h0 text-5 style="line-height: 0">
        {{ subStr(nickname) }}
      </span>
      <div v-else i-mingcute:user-2-fill />
    </div>
    <slot />
  </div>
</template>
