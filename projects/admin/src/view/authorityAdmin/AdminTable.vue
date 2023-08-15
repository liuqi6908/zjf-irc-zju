<script setup lang="ts">
import { QTree, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { HeaderSlot } from '~/components/table/BaseTable.vue'

interface Props {
  rows: Array<any>
  col: QTableProps['columns']
  /** tree节点 */
  treeNode: QTree['nodes']
  header?: Array<HeaderSlot>
}
defineProps<Props>()
defineEmits(['update:rows', 'update:save'])

const $q = useQuasar()

const baseTableRef = ref(null)

/** input组件 */
const input = ['roleName']
/** 树结构组件 */
const tree = ['verify', 'downLoadVerify']
/** select组件 */
const select = ['roleAssign']
/** dialog组件 */
const dialog = ['attachment']

// function save(rowItem: any) {
//   console.log({ rowItem })
// }

function deleteRowItem(rowItem: any) {
  if (baseTableRef.value)
    baseTableRef.value.deleteRow(rowItem)
}

function check(rowItem: any) {
  let message = ''
  if (!Array.isArray(rowItem) || !rowItem.length)
    message = '暂无数据'

  rowItem.forEach((item) => {
    message += `<img src=${item} /><br/>`
  })

  $q.dialog({
    title: '资料列表',
    message,
    html: true,
  })
}
</script>

<template>
  <BaseTable
    ref="baseTableRef"
    v-slot="{ props, col }"
    :rows="rows"
    :col="col"
    :header="header"
    @update:rows="(val) => $emit('update:rows', val)"
  >
    <q-input v-if="input.includes(col)" v-model="props.row[`${col}`]" label="可编辑" />

    <QTree
      v-else-if="tree.includes(col)"
      v-model:ticked="props.row[`${col}`]"
      tick-strategy="leaf"
      :nodes="treeNode"
      node-key="label"
      default-expand-all
    />

    <div v-else-if="col === 'operation'" flex="~ row justify-start">
      <q-btn color="primary-1" label="保存" mr-2 @click="$emit('update:save', props.row)" />
      <q-btn color="red" label="删除">
        <q-popup-proxy>
          <q-banner flex="~ row">
            <div text-grey-5>
              确认删除？
            </div>
            <q-btn dense mr-3 color="teal" label="确认" @click="deleteRowItem(props.row)" />
            <q-btn v-close-popup color="red" dense label="取消" />
          </q-banner>
        </q-popup-proxy>
      </q-btn>
    </div>

    <div v-else-if="dialog.includes(col)" flex="~ row">
      <q-btn flat label="查看" text-primary-1 @click="check(props.row[`${col}`])" />
    </div>

    <q-select v-else-if="select.includes(col)" v-model="props.row[`${col}`]" />

    <div v-else flex="~ row">
      {{ props.row[`${col}`] }}
    </div>
  </BaseTable>
</template>
