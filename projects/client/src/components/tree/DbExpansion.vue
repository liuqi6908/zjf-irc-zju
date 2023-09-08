<script lang="ts" setup>
interface Props {
  label: string
  labelClass?: string
}
withDefaults(defineProps<Props>(), {})

const open = ref(false)
</script>

<template>
  <div class="db-expansion">
    <!--  -->
    <q-item dense clickable full flex="~" items-center gap1 @click="open = !open">
      <div
        class="dropdown-icon"
        :style="{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }"
        h6 w6 flex-center transition-all
      >
        <slot name="dropdown-icon">
          <svg width="10" height="5" viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 5L5 0L10 5H0Z" fill="#A6B1C2" />
          </svg>
        </slot>
      </div>
      <slot name="label">
        <div>{{ label }}</div>
      </slot>
    </q-item>
    <q-expansion-item
      v-model="open"
      header-class="display-none"
    >
      <slot />
    </q-expansion-item>
  </div>
</template>

<style lang="sass" scoped></style>
