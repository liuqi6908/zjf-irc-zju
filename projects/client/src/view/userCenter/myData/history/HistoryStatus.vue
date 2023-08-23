<script setup lang="ts">
interface Props {
  status: 'success' | 'error' | 'warning'
}
const props = defineProps<Props>()

const textContent = reactive({
  success: { text: '已通过', icon: 'i-material-symbols:done' },
  error: { text: '已驳回', icon: 'i-material-symbols:close-rounded' },
  warning: { text: '审核中', icon: 'i-material-symbols:horizontal-rule' },
})

const statusClass = computed(() => {
  return [`bg-alert-${props.status}`, 'text-grey-1']
})
</script>

<template>
  <div :class="[...statusClass]" flex-center gap-1 rounded-6 px-3 py-1>
    <div h-4 w-4 flex-center rounded-9999 bg-grey-1>
      <div :class="[`${textContent[status].icon}`, `bg-alert-${status}`]" h-4 w-4 />
    </div>

    <span font-500 text-grey-1>{{ textContent[status].text }}</span>
  </div>
</template>

<style lang="">

</style>
