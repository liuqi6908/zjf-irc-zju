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

const obj: Record<string, any> = reactive(cmsConfig.find(v => v.id === page)?.children.find(v => v.id === id) || {})
const loading = ref(false)
const dialog = ref(false)

onMounted(async () => {
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
})

/**
 * 当前的组件所需要的props
 */
const rowsJson = computed(() => {
  const json = [] as any
  const cloneRow = cloneDeep(obj.rows)
  if (cloneRow) {
    cloneRow.forEach((item: any, index: number) => {
      json.push({
        name: `silder${index}`,
        title: item.title,
        img: item.uploadImg,
        richText: item.richText,
      })
    })
  }
  return json
})

async function saveRows() {
  $q.dialog({
    title: '更新确认',
    message: '该操作将更新问答管理页面内容，是否继续？',
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
    catch (_) { }
    finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <q-card h-full>
    <EditableGrid
      v-model:rows="obj.rows"
      v-model:dialog="dialog"
      :loading="loading"
      :col-names="obj.col"
      :component-name="obj.label"
      @save="saveRows"
    />
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
