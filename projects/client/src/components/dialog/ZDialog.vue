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
  cancelText?: string
  confirmText?: string
}

withDefaults(defineProps<Props>(), {
  cancelText: '取消',
  confirmText: '确认',
})
defineEmits([...useDialogPluginComponent.emits, 'update:back', 'update:modelValue'])
</script>

<template>
  <q-dialog
    persistent
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card rounded="!0" flex="~ col" min-w-lg gap-6 p6>
      <header flex="~ row justify-between items-center" h4>
        <div>
          <Btn v-if="back" @click="$emit('update:back')" />
          <div>
            <span text-4 font-600 text-grey-8>{{ title }}</span><span text-grey-6>{{ caption }}</span>
          </div>
        </div>

        <q-btn v-close-popup dense flat h7 w7 translate-x-2 p0>
          <div i-mingcute:close-line text-grey-5 />
        </q-btn>
      </header>

      <div rounded="0!">
        <slot />
      </div>

      <footer v-if="footer" flex flex-row justify-end>
        <div flex="~ row" gap6>
          <q-btn
            v-close-popup
            color="primary" square h10 min-w-28 outline
          >
            <span text-3.5 font-500>{{ cancelText }}</span>
          </q-btn>
          <q-btn
            v-close-popup flat square h10 min-w-28 bg-primary-1
            text-white :disable="disableConfirm"
            @click="$emit('ok')"
          >
            <span text-3.5 font-500>{{ confirmText }}</span>
          </q-btn>
        </div>
      </footer>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>

</style>
