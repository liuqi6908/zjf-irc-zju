<script lang="ts" setup>
import { useDialogPluginComponent } from 'quasar'

interface Props {
  modelValue: boolean
  title: string
  back?: boolean
}

defineProps<Props>()
defineEmits([...useDialogPluginComponent.emits, 'update:back'])
</script>

<template>
  <q-dialog :model-value="modelValue">
    <q-card p-6 style="border-radius: 12px !important;">
      <div flex="~ row justify-between items-center" mb-6>
        <div>
          <btn v-if="back" @click="$emit('update:back')" />
          <span text-4 font-600 text-grey-8>{{ title }}</span>
        </div>

        <btn v-close-popup icon="i-mingcute:close-line" flat text-grey-5 />
      </div>

      <div>
        <slot />
      </div>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>

</style>
