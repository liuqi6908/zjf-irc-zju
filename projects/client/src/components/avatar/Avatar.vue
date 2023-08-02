<script setup lang="ts">
interface Props {
  name: string
  size?: number
  visitor?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  size: 30,
})
const subStr = computed(() => {
  if (!props.name)
    return ''
  const sub = props.name.substring(0, 1)
  return sub
},
)
</script>

<template>
  <div
    :style="{ width: `${size}px`, height: `${size}px` }"
    flex-center border-size-1.5 b-primary-1 rounded-full text-primary-1
  >
    <div v-if="visitor" i-mingcute:user-2-fill />
    <span v-else>
      {{ subStr }}
    </span>
  </div>
</template>

<style lang="scss">

</style>
