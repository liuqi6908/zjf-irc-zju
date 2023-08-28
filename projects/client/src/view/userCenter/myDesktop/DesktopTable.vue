<script lang="ts" setup>
interface Props {
  cols: string[]
  rows: string[]
}
defineProps<Props>()
</script>

<template>
  <div>
    <table min-w-80>
      <tr bg-grey-2>
        <td v-for="(col, index) in cols" :key="index">
          {{ col }}
        </td>
      </tr>

      <tr>
        <td v-for="(row, index) in rows" :key="index">
          {{ row }}
        </td>
      </tr>
    </table>
  </div>
</template>

<style lang="scss" scoped>
table,
td {
  border: 1px solid #F5F7FA;
  height: 40px;
}
</style>
