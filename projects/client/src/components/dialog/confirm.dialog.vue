<script lang="ts" setup>
import { computed } from 'vue'
import { useDialogPluginComponent } from 'quasar'

import type { ConfirmDialogProps } from './use-dialog'

interface Props {
  options?: ConfirmDialogProps
}
const props = defineProps<Props>()

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const btnPrimary = computed(() => {
  if (props.options?.color?.replace(/\s+/g, '') === 'var(--q-primary)')
    return undefined
  return props.options?.color
})
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card
      text-grey-8 rounded="0!"
      class="q-pa-lg br-12 column no-wrap"
      style="width: 90%; max-width: 400px; min-height: 150px;"
    >
      <div absolute right-4 top-4>
        <q-btn
          color="primary" icon="fas fa-times"
          style="--q-primary: #e0e0e0"
          dense flat h7 w7 rounded-full px0 py0
        />
      </div>
      <header class="font-500" text-4>
        <slot name="title">
          {{ options?.title || "是否确认?" }}
        </slot>
      </header>
      <main class="q-py-md">
        <slot>
          <div v-if="options?.content" class="confirm-dialog__content">
            {{ options.content }}
          </div>
        </slot>
      </main>
      <footer class="no-wrap row items-center justify-end" mt4 gap2>
        <q-btn
          v-close-popup
          color="grey-7"
          square min-w-22 px4 outline
          :label="options?.cancelText || '取消'"
          :style="btnPrimary ? `--q-primary: ${btnPrimary}` : '--q-primary: var(--grey-5)'"
          @click="onDialogCancel"
        />
        <q-btn
          class="bg-primary"
          :label="options?.okText || '确认'"
          flat square min-w-22 px4 text-white
          :style="btnPrimary ? `--q-primary: ${btnPrimary}` : ''"
          @click="onDialogOK()"
        />
      </footer>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped></style>
