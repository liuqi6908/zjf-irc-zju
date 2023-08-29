<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'

interface Props {
  modelValue: boolean
  title: string
  caption?: string
  back?: boolean
  footer?: boolean
  confirmEvent?: () => void
  disableConfirm?: boolean
}

defineProps<Props>()
defineEmits([...useDialogPluginComponent.emits, 'update:back', 'update:modelValue'])
</script>

<template>
  <q-dialog
    persistent
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card min-w-lg p-6 style="border-radius: 0px !important;">
      <div flex="~ row justify-between items-center" mb-6>
        <div>
          <Btn v-if="back" @click="$emit('update:back')" />
          <div>
            <span text-4 font-600 text-grey-8>{{ title }}</span><span text-grey-6>{{ caption }}</span>
          </div>
        </div>

        <Btn :close-popup="modelValue" icon="i-mingcute:close-line" flat text-grey-5 />
      </div>

      <div>
        <slot />
      </div>

      <footer v-if="footer" mt-10 flex flex-row justify-end>
        <div flex="~ row">
          <Btn label="取消" :close-popup="modelValue" mr-6 outline />
          <Btn label="确认" :disable="disableConfirm" :close-popup="modelValue" @click="$emit('ok')" />
        </div>
      </footer>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>

</style>
