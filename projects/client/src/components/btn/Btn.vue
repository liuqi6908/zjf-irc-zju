<script setup lang="ts">
interface Props {
  label?: string
  transparent?: boolean
  outline?: boolean
  icon?: string
  bgColor?: string
  /** 字体颜色 */
  color?: string
  disable?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  bgColor: 'primary',
  color: 'white',
})
const btnClass = computed(() => {
  if (!props.transparent && !props.outline)
    return [`text-${props.color}`, `bg-${props.bgColor}`]
  else
    return `text-${props.bgColor}`
})
</script>

<template>
  <q-btn
    :flat="transparent === true"
    :label="label"
    :outline="outline === true"
    :class="btnClass"
    unelevated
    :disable="disable"
    rounded-2
  >
    <div v-if="transparent" class="translucent-mask" :class="`bg-${bgColor}`" />
  </q-btn>
</template>

<style scoped>
.q-btn >>> .q-btn__content {
    border-radius:inherit;
}
.translucent-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0.12;
    border-radius:inherit;
}
</style>
