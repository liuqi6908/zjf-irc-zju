<script lang="ts" setup>
export interface ItemList {
  name: string
  id: string
  icon?: string
  back?: boolean
  backIcon?: string
  iconSize?: number
  clickId?: string
  clickEvent?: (() => void)
  transparent?: boolean
  closePopup?: boolean
}
const props = withDefaults(defineProps<ItemList>(), {
  iconSize: 24,
  backIcon: 'i-mingcute:right-line',
})
const emits = defineEmits(['update:id'])

function click() {
  emits('update:id', props.id)
  if (!props.clickEvent)
    return
  props.clickEvent()
}
</script>

<template>
  <q-item
    v-close-popup="closePopup || false"
    clickable text-grey-8
    :active-class="transparent ? 'text-primary-1 opacity-primary-1' : 'text-grey-1 bg-primary-1'"
    :active="clickId === id"
    @click="click()"
  >
    <NavItemSection :icon="icon" :name="name" :back-icon="backIcon" :back="back" :icon-size="iconSize" />
  </q-item>
</template>

<style lang="scss" scoped>
.opacity-primary-1 {
  background-color: rgba(48, 123, 246, 0.12);
}
</style>
