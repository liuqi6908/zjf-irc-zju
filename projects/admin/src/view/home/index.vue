<script setup lang="ts">
import { cmsConfig } from 'shared/constants'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { getCms } from '~/api/cms/getCms'
import { upsertCms } from '~/api/cms/upsertCms'

interface Props {
  page: string
  id: string | number
}

const { page, id } = defineProps<Props>()
const $q = useQuasar()

const obj = reactive<Record<string, any>>(cmsConfig.find(v => v.id === page)?.children.find(v => v.id === id) || {})
const loading = ref(false)
const dialog = ref(false)

onMounted(reset)

/**
 * 当前的组件所需要的props
 */
const rowsJson = computed(() => {
  const json: any[] = []
  const cloneRow = cloneDeep(obj.rows)
  if (cloneRow) {
    cloneRow.forEach((item: any, index: number) => {
      const { title, uploadImg, richText } = item
      json.push({
        name: `slider${index}`,
        title,
        img: uploadImg,
        richText,
      })
    })
  }
  return json
})

/**
 * 添加一行数据
 */
function addRow() {
  const row: any = {}
  const arr = ['delete', 'sort', 'add']
  for (const key of obj.col) {
    if (!arr.includes(key))
      row[key] = ''
  }
  obj.rows.push(row)
}

/**
 * 重置
 */
async function reset() {
  loading.value = true
  try {
    const res = await getCms(obj.id)
    if (res)
      obj.rows = res.json
  }
  catch (_) {}
  finally {
    loading.value = false
  }
}

/**
 * 保存
 */
async function save() {
  $q.dialog({
    title: '更新确认',
    message: `该操作将更新${obj.label}页面内容，是否继续？`,
    cancel: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const res = await upsertCms(obj.id, obj.rows)
      if (res) {
        $q.notify({
          type: 'success',
          message: '保存成功',
        })
      }
    }
    catch (_) {}
    finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <q-card h-full>
    <div h-full flex="~ col" text-left>
      <!-- 加载中 -->
      <q-inner-loading
        :showing="loading"
        label="加载中..."
        color="primary"
        label-class="text-primary"
        z-99
      />

      <!-- 操作栏 -->
      <div p="y-3 x-4" flex="~ row justify-between">
        <div>
          <q-btn
            v-if="obj.col.includes('add')"
            color="primary"
            label="新增一行"
            @click="addRow"
          >
            <q-icon name="fas fa-plus" size="14px" ml-2 />
          </q-btn>
        </div>
        <div>
          <q-btn
            color="secondary"
            label="重置" mr-4
            @click="reset"
          />
          <q-btn
            color="primary"
            label="预览" mr-4
            @click="dialog = true"
          />
          <q-btn
            color="green"
            label="保存"
            @click="save"
          />
        </div>
      </div>

      <!-- 页面内容 -->
      <q-scroll-area flex-1 p-4>
        <EditableGrid
          v-model:rows="obj.rows"
          :cols="obj.col"
          :label="obj.label"
        />
      </q-scroll-area>
    </div>

    <!-- 预览弹窗 -->
    <q-dialog v-model="dialog" full-width full-height>
      <q-card relative px-8 py-14>
        <q-btn v-close-popup size="14px" icon="fas fa-times" absolute flat px-1 right-4 top-2 />
        <div full overflow-auto>
          <component :is="obj.component" :list="rowsJson" />
        </div>
      </q-card>
    </q-dialog>
  </q-card>
</template>
