<script lang="ts" setup>
interface Props {
  modelValue: any
  options?: Array<{ label: string; id: string | number }>
  label?: string
  chip?: boolean
  placeholder?: string
}
defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <q-select
    text-grey-4 outlined
    dropdown-icon="fa fa-chevron-down"
    :label="label"
    :options="options"
    :model-value="modelValue"
    popup-content-class="z-select-dropdown-menu rounded-0 shadow-none py2 text-grey-8"
    popup-content-style="box-shadow: 0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)"
    :menu-offset="[0, 8]"
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
    .q-field__native {
      height: auto !important;
      min-height: 24px !important;
    }
  }
  .q-field__bottom .q-field__messages{
    color: $error-color  !important;
    color: $error-color !important
  }
  .q-select__dropdown-icon {
    font-size: 12px;
  }
}
.q-input :deep(.text-negative) {
  color: $error-color !important
}
</style>

<style lang="sass">
.z-select-dropdown-menu
  .q-item
    text-align: center
    .q-focus-helper::before
      background: var(--primary-1)
  .q-item.q-manual-focusable--focused
    color: var(--primary-1)
</style>
