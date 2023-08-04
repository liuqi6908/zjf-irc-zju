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
}
const props = withDefaults(defineProps<ItemList>(), {
  iconSize: 18,
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
    clickable
    border-rd-2
    text-grey-5
    active-class="text-primary-1 opacity-primary-1"
    :active="clickId === id"
    @click="click()"
  >
    <NavItemSection :icon="icon" :name="name" :back-icon="backIcon" :back="back" :icon-size="iconSize" />
  </q-item>
</template>

<style lang="scss" scoped>

</style>
