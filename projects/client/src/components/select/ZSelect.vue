<script lang="ts" setup>
interface Props {
  modelValue: any
  options: Array<{ label: string; id: string }>
  label?: string
  chip?: boolean
}
defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <q-select
    dense outlined text-grey-4
    dropdown-icon="fa fa-chevron-down"
    :label="label"
    :options="options"
    :model-value="modelValue"
    popup-content-class="rounded-2 p-2 text-grey-8"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <template #selected-item="scope">
      <slot v-if="chip" :scope="scope" />
      <div v-else text-grey-8>
        {{ scope.opt.label }}
      </div>
    </template>
  </q-select>
</template>

<style lang="scss" scoped>
$error-color:#FF8080;

.q-field :deep(.q-field__inner){
    .q-field__control {
      border-radius: 0px !important;
      border-color: 1px solid var(--grey-3, #D4DDEA);
    }
    .q-field__bottom .q-field__messages{
      color: $error-color  !important;
      color: $error-color !important
    }
}
.q-input :deep(.text-negative) {
      color: $error-color !important
}
</style>
