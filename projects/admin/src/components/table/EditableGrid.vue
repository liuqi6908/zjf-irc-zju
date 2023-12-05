<script setup lang="ts">
import '@wangeditor/editor/dist/css/style.css'

interface Props {
  /** 需要编辑的项目 */
  rows: any[]
  cols: string[]
  label: string
}

const { rows } = defineProps<Props>()
const emits = defineEmits(['update:rows'])

const RichEdit = defineAsyncComponent(() => import('./RichEdit.vue'))

/**
 * 删除一行数据
 * @param index
 */
function deleteRow(index: number) {
  rows.splice(index, 1)
}

/**
 * 更新排序
 * @param index
 * @param sort
 */
function upSort(index: number, sort: 'up' | 'down') {
  if (
    sort === 'up' && index === 0 ||
    sort === 'down' && index === rows.length - 1
  )
    return
  try {
    if (sort === 'up') {
      const temp = rows[index]
      rows[index] = rows[index - 1]
      rows[index - 1] = temp
    }
    else {
      const temp = rows[index]
      rows[index] = rows[index + 1]
      rows[index + 1] = temp
    }
  }
  catch (e) {}
}
</script>

<template>
  <div>
    <q-list bordered rounded-2 overflow-hidden>
      <template
        v-for="(row, index) in rows"
        :key="index"
      >
        <q-expansion-item
          :group="label"
          switch-toggle-side
          expand-icon-class="text-sm"
        >
          <template #header>
            <div flex="~ 1 row items-center justify-between">
              <div text-lg font-600 v-text="cols.includes('title') ? row.title || '未命名标题' : label" />
              <div flex="~ row gap-2">
                <q-btn
                  v-if="cols.includes('delete')"
                  flat px-2
                  @click.stop="deleteRow(index)"
                >
                  <div i-mingcute:delete-2-line text-red />
                </q-btn>
                <template v-if="cols.includes('sort')">
                  <q-btn
                    :class="{ disabled: index === 0 }"
                    flat px-2
                    @click.stop="upSort(index, 'up')"
                  >
                    <div i-mingcute:arrow-up-fill />
                  </q-btn>
                  <q-btn
                    :class="{ disabled: index === rows.length - 1 }"
                    flat px-2
                    @click.stop="upSort(index, 'down')"
                  >
                    <div i-mingcute:arrow-down-fill />
                  </q-btn>
                </template>
              </div>
            </div>
          </template>
          <q-card p-4 flex="~ col gap-6">
            <div v-if="cols.includes('title')" flex="~ col gap-2">
              <div font-500>标题：</div>
              <q-input
                v-model="row.title"
                filled dense
              />
            </div>
            <div v-if="cols.includes('uploadImg')" flex="~ col gap-2">
              <div font-500>上传图片：</div>
              <UploadFile v-model:urlImg="row.uploadImg" w-40 />
            </div>
            <div v-if="cols.includes('svg')" flex="~ col gap-2">
              <div font-500>上传SVG：</div>
              <UploadFile v-model:urlImg="row.svg" svg w-40 />
            </div>
            <div v-if="cols.includes('richText')" flex="~ col gap-2">
              <div font-500>富文本：</div>
              <ClientOnly>
                <RichEdit v-model="row.richText" />
              </ClientOnly>
            </div>
          </q-card>
        </q-expansion-item>

        <q-separator v-if="index !== rows.length - 1" />
      </template>
    </q-list>
  </div>
</template>

<style lang="scss" scoped>
.q-list {
  .q-expansion-item {
    :deep(.q-item__section--side) {
      padding: 0;
      .q-icon {
        font-size: 16px;
      }
    }

    &.q-expansion-item--expanded {
      :deep(.q-item--clickable) {
        border-bottom: 1px solid #ccc;
      }
    }
  }
}
</style>
