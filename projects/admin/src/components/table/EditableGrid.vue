<script setup lang="ts">
interface NameType {
  title: string
  imgUpload: string
  content: string
}

interface Props {
  /** 表单需要编辑的内容 */
  colNames: Array<keyof NameType>
}
defineProps<Props>()

const columns = [
  {
    name: 'title',
    required: true,
    label: '输入标题',
    align: 'left',
    field: 'title',
    format: val => `${val}`,
    sortable: true,
  },
  { name: 'content', align: 'left', label: '编辑内容', field: 'content', sortable: true },
  { name: 'uploadImg', label: '上传图片', align: 'left', field: 'uploadImg', sortable: true },
  { name: 'delete', label: '删除', align: 'left', field: 'delete', sortable: true },
]

const rows = reactive([
  {
    title: 'Frozen Yogurt',
    content: 159,
    uploadImg: 6.0,
    delete: 16546,
  },
  {
    title: '13244',
    content: 159,
    uploadImg: 6.0,
    delete: 16546,
  },
])

function addRow() {

}

function deleteRow(target: any) {
  const targetIndex = rows.findIndex((row) => {
    for (const key in target) {
      if (target[key] !== row[key])
        return false
    }
    return true
  })

  if (targetIndex !== -1)
    rows.splice(targetIndex, 1)
}
</script>

<template>
  <div>
    <q-table
      class="q-pa-md"
      flat bordered
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template #top>
        <q-btn color="primary" label="增加一项" @click="addRow" />
      </template>

      <template #body="props">
        <q-tr :props="props">
          <q-td key="title" :props="props">
            <q-input v-model="props.row.title" />
          </q-td>

          <q-td key="content" :props="props">
            <q-input v-model="props.row.content" color="green" />
          </q-td>

          <q-td key="uploadImg" :props="props">
            <q-uploader
              url="http://localhost:4444/fileuploader/upload"
              label="Upload"
              style="max-width: 300px"
            />
          </q-td>
          <q-td key="delete" :props="props">
            <q-btn flat @click="deleteRow(props.row)">
              <div i-mingcute:delete-2-line text-red />
            </q-btn>
          </q-td>
        </q-tr>
      </template>

      <template #bottom>
        <div w-full flex="~ row justify-end">
          <q-btn color="secondary" label="保存编辑内容" />
        </div>
      </template>
    </q-table>
  </div>
</template>
