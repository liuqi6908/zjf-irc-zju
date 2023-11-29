<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'

import type { ConfirmDialogProps } from './use-dialog'

interface Props {
  options?: ConfirmDialogProps
}
defineProps<Props>()

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()
</script>

<template>
  <q-dialog ref="dialogRef" persistent>
    <q-card
      text-grey-8 rounded="0!"
      class="q-pa-lg br-12 column no-wrap"
      style="width: 90%; max-width: 400px; min-height: 150px;"
    >
      <!-- <div absolute right-4 top-4>
        <q-btn
          color="primary" icon="fas fa-times"
          style="--q-primary: #e0e0e0"
          dense flat h7 w7 rounded-full px0 py0
        />
      </div> -->
      <header flex="~ row justify-between items-center" h4>
        <div text-base font-600>
          {{ options?.title || "是否确认?" }}
        </div>

        <q-btn v-close-popup dense flat h7 w7 translate-x-2 p0>
          <div i-mingcute:close-line text-grey-5 />
        </q-btn>
      </header>
      <main class="q-py-md">
        <slot>
          <div v-if="options?.content" class="confirm-dialog__content">
            {{ options.content }}
          </div>
        </slot>
      </main>
      <footer class="no-wrap row items-center justify-end" mt4 gap6>
        <q-btn
          v-close-popup
          color="primary" square h10 min-w-28 outline
          @click="onDialogCancel"
        >
          <span text-3.5 font-500>{{ options?.cancelText || '取消' }}</span>
        </q-btn>
        <q-btn
          v-close-popup flat square h10 min-w-28 bg-primary-1
          text-grey-1
          @click="onDialogOK"
        >
          <span text-3.5 font-500>{{ options?.okText || '确认' }}</span>
        </q-btn>
      </footer>
    </q-card>
  </q-dialog>
</template>

<style lang="sass" scoped></style>
