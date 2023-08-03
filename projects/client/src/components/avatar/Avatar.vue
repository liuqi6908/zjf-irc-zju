<script setup lang="ts">
interface Props {
  nickname?: string
  avatarUrl?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 30,
})

defineEmits(['update:route'])

const dropDown = ref(false)

function subStr(name: string) {
  if (!name)
    return ''
  const sub = name.substring(0, 1)
  return sub
}

function avatarBehavior() {
  dropDown.value = !dropDown.value
}

function getImageUrl(url: string) {
  return new URL(`${url}`, import.meta.url).href
}
</script>

<template>
  <div />
  <div
    :style="{ width: `${size}px`, height: `${size}px` }"
    flex-center cursor-pointer border-size-1.5 b-primary-1 rounded-full text-primary-1
    @click="avatarBehavior(), $emit('update:route')"
  >
    <div
      v-if="avatarUrl" overflow-hidden
      :style="{ width: `${size}px`, height: `${size}px`, background: `${getImageUrl(avatarUrl)} cover` }"
    />
    <span v-else-if="nickname">
      {{ subStr(nickname) }}
    </span>
    <div v-else i-mingcute:user-2-fill />
  </div>
<!--
  <Btn
    v-if="authToken"
    label="退出登录"
    transparent clickable right-0 top-16
    @click="useLogout()"
  /> -->
</template>

<style lang="scss">

</style>
