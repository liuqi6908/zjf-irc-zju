<script lang="ts" setup>
interface Props {
  cols: Array<{ name: string; label: string }>
  rows?: Array<any>
}
defineProps<Props>()
</script>

<template>
  <table min-w-80>
    <tr bg-grey-2 px-4>
      <td v-for="(col, index) in cols" :key="index">
        {{ col.label }}
      </td>
    </tr>
    <tr v-if="!rows || !rows.length">
      <slot />
    </tr>

    <tr v-for="(row, index) in rows" v-else :key="index">
      <td v-for="(col, index) in cols" :key="index" text-grey-8>
        {{ row[col.name] }}
      </td>
    </tr>
  </table>
</template>

<style lang="scss" scoped>
table,
td {
  border: 1px solid #F5F7FA;
  height: 40px;
}
</style>
