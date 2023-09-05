<script lang="ts" setup>
import { debounce } from 'quasar'

interface Props {
  modelValue: any
  idKey?: string
  labelKey?: string
  items: any[]
}
const $props = withDefaults(defineProps<Props>(), {
  idKey: 'id',
  labelKey: 'label',
  items: () => [],
})
const $emit = defineEmits<{
  'update:modelValue': [v: any]
}>()

const $elRef = ref<HTMLElement>()
const indicatorStyle = ref<Record<string, any>>({})

function nav(tab: any) {
  $emit('update:modelValue', tab[$props.idKey])
  nextTick(updateIndicator)
}

function updateIndicator() {
  if (!$elRef.value)
    return
  const rect = $elRef.value.querySelector('.database-tab--active')?.getBoundingClientRect()
  if (!rect)
    return
  const containerRect = $elRef.value.getBoundingClientRect()

  const style: Partial<CSSStyleDeclaration> = {
    width: `${rect.width / 3 - 12}px`,
    transform: 'translateX(-50%)',
    left: `${rect.left - containerRect.left + rect.width / 2}px`,
    top: `${rect.bottom - containerRect.top - 4}px`,
  }
  indicatorStyle.value = style
}

useResizeObserver($elRef, debounce(updateIndicator, 50))
</script>

<template>
  <div
    ref="$elRef" class="database-tabs"
    flex="~"
    relative flex-wrap items-center gap-1
  >
    <q-item
      v-for="tab in items"
      :key="tab[idKey]"
      class="database-tab"
      :class="{ 'database-tab--active': modelValue === tab[idKey] }"
      flex="~ center"
      clickable max-w-full text-nowrap text-16px
      @click="nav(tab)"
    >
      <span w-full overflow-hidden text-ellipsis>
        {{ tab[labelKey] }}
      </span>
    </q-item>
    <div
      absolute h1 bg-primary-1
      class="database-tab-indicator" :style="indicatorStyle"
    />
  </div>
</template>

<style lang="sass" scoped>
.database-tab
  color: var(--grey-5)
  font-weight: 600
  &--active
    color: var(--grey-8)

  &-indicator
    transition: all 0.35s ease
</style>
