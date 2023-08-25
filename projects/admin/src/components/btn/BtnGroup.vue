<script lang="ts" setup>
export type BtnStatus = 'access' | 'reject' | 'save' | 'change' | 'delete' | 'expired'
interface Props {
  types: Array<BtnStatus>
}
const props = defineProps<Props>()
defineEmits(['update:access', 'update:reject', 'update:save', 'update:change', 'update:delete', 'update:expired'])

const typeColor: Record<BtnStatus, any> = {
  access: { color: 'teal', label: '通过' },
  delete: { color: 'negative', label: '删除', showPopup: true },
  reject: { color: 'negative', label: '驳回', showPopup: true },
  save: { color: 'primary-1', label: '保存' },
  change: { color: 'accent', label: '修改' },
  expired: { color: 'negative', label: '到期' },
}

const btns = computed(() => {
  if (props.types.length) {
    return props.types.map((btn) => {
      typeColor[btn].key = btn
      return typeColor[btn]
    })
  }
})
</script>

<template>
  <div w-full flex="~ row gap-4 flex-nowrap">
    <div v-for="btn in btns" :key="btn.key">
      <q-btn v-if="!btn.showPopup" :label="btn.label" :color="btn.color" text-grey-1 @click="$emit(`update:${btn.key}`)" />

      <q-btn v-else :label="btn.label" :color="btn.color" text-grey-1>
        <q-popup-proxy>
          <q-banner flex="~ row">
            <div text-grey-5>
              {{ `确认${btn.label}?` }}
            </div>
            <q-btn dense mr-3 color="teal" label="确认" @click="$emit(`update:${btn.key}`)" />
            <q-btn v-close-popup color="negative" dense label="取消" />
          </q-banner>
        </q-popup-proxy>
      </q-btn>
    </div>
  </div>
</template>

<style lang="">

</style>
