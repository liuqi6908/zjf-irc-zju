<script setup lang="ts">
import { Notify, QTree, useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { OperationType } from '~/components/table/BaseTable.vue'

import { deleteRoles } from '~/api/dataPermission/delectDataRole'
import { getUrlByToken } from '~/api/file/getUrl'

interface Props {
  rows: Array<any>
  col: QTableProps['columns']
  /** tree节点（权限选择） */
  treeNode: QTree['nodes']
  loading: false
  /** select options（角色列表） */
  selectList: Array<string>
  operation?: Array<OperationType>
}
defineProps<Props>()
defineEmits(['update:rows', 'update:save'])

const $q = useQuasar()

const baseTableRef = ref(null)

/** input组件 */
const input = ['roleName', '']
/** 树结构组件 */
const tree = ['verify', 'downLoadVerify']
/** select组件 */
const select = ['roleAssign']
/** dialog组件 */
const dialog = ['attachments']

// function save(rowItem: any) {
//   console.log({ rowItem })
// }

async function deleteRowItem(rowItem: any) {
  if (baseTableRef.value) {
    baseTableRef.value.deleteRow(rowItem)

    const res = await deleteRoles(rowItem.roleName)
    if (res) {
      Notify.create({
        message: '删除成功',
        type: 'success',
      })
    }
  }
}

function check(rowItem: any) {
  let message = ''
  if (!Array.isArray(rowItem) || !rowItem.length)
    message = '暂无数据'

  const userId = rowItem.userId

  rowItem.attachments.forEach((filename: string) => {
    const src = getUrlByToken(`file/private/verify/${userId}/${filename}`)
    message += `<img src=${src} /><br/>`
  })

  $q.dialog({
    title: '资料列表',
    message,
    html: true,
  })
}

function onLazyLoad({ node, key, done, fail }) {
  // call fail() if any error occurs

  setTimeout(() => {
    // simulate loading and setting an empty node
    if (!node.children.length) {
      done([])
      return
    }
    done(node.children)
  }, 1000)
}
</script>

<template>
  <BaseTable
    ref="baseTableRef"
    v-slot="{ props, col }"
    :rows="rows"
    :cols="col"
    :operation="operation"
    :loading="loading"
    @update:rows="(val) => $emit('update:rows', val)"
  >
    <q-input v-if="input.includes(col)" v-model="props.row[`${col}`]" label="可编辑" />

    <QTree
      v-else-if="tree.includes(col)"
      v-model:ticked="props.row[`${col}`]"
      no-transition
      tick-strategy="leaf"
      :nodes="treeNode"
      node-key="id"
      label-key="nameZH"
      @lazy-load="onLazyLoad"
    />

    <BtnGroup
      v-else-if="col === 'operation'"
      :types="['delete', 'save']"
      @update:save="$emit('update:save', props.row)"
      @update:delete="deleteRowItem(props.row)"
    />
    <BtnGroup
      v-else-if="col === 'saveRows'"
      :types="['save']"
      @update:save="$emit('update:save', props.row)"
    />

    <div v-else-if="dialog.includes(col)" flex="~ row">
      <q-btn flat label="查看" text-primary-1 @click="check(props.row)" />
    </div>

    <q-select
      v-else-if="select.includes(col)"
      v-model="props.row[`${col}`]"
      :options="selectList"
    />

    <div v-else flex="~ row">
      {{ props.row[`${col}`] }}
    </div>
  </BaseTable>
</template>
