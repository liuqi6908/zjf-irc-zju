<script setup lang="ts">
import type { QBtnGroupProps } from 'quasar'

interface Props extends QBtnGroupProps {
  label?: string
  transparent?: boolean
  outline?: boolean
  icon?: string
  iconColor?: string
  bgColor?: string
  /** 字体颜色 */
  color?: string
  disable?: boolean
  flat?: boolean
  closePopup?: boolean
  dense?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bgColor: 'primary',
  color: 'white',
})
const btnClass = computed(() => {
  if (props.icon)
    return 'text-grey-5'
  if (!props.transparent && !props.outline)
    return [`text-${props.color}`, `bg-${props.bgColor}`]
  else
    return `text-${props.bgColor}`
})

const finalProps = computed(() => ({ props }))
</script>

<template>
  <q-btn
    v-close-popup="closePopup || false"
    v-bind="finalProps"
    :flat="flat || transparent === true"
    :label="label"
    :outline="outline === true"
    :class="btnClass"
    :disable="disable"
    :dense="dense"
    unelevated rounded-2
  >
    <div v-if="transparent" class="translucent-mask" :class="`bg-${bgColor}`" />
    <template v-if="icon">
      <div :class="[icon, ...btnClass]" h-4 w-4 />
    </template>
    <div absolute>
      <slot />
    </div>
  </q-btn>
</template>

<style scoped>
.q-btn :deep(.q-btn__content) {
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
