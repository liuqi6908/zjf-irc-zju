<script lang="ts" setup>
interface Props {
  modelValue: any
  options: Array<{ label: string; id: string }>
  label?: string
}
defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <q-select
    outlined dense text-grey-4
    dropdown-icon="fa fa-chevron-down"
    :label="label"
    :options="options"
    :model-value="modelValue"
    popup-content-class="rounded-2 p-2"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <template #option="scope">
      <q-item rounded-2 v-bind="scope.itemProps">
        <q-item-section>
          {{ scope.opt.label }}
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<style lang="scss" scoped>
.q-field :deep(.q-field__inner){
    .q-field__control {
      border-radius: 8px !important;
    }
    .q-field__control:before{
      border: 1px solid var(--grey-3, #D4DDEA); ;
    }
}
</style>
