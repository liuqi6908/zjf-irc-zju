<script setup lang="ts">
import { Dialog, Notify } from 'quasar'
import type { Node } from '../SetRoles.vue'
import RoleTree from './RoleTree.vue'
import type { IRequest } from '~/api/dataRole'
import { queryDataRoleInfo, upsertDataRole } from '~/api/dataRole'

interface Props {
  modelValue: boolean
  tree: Node[]
  name: string
}

const props = defineProps<Props>()
const $emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const desc = ref('')
/** 访问权限 */
const view: string[] = reactive([])
/** 下载权限 */
const download: string[] = reactive([])

onMounted(() => {
  getRolesList()
})

/**
 * 获取权限列表
 */
async function getRolesList() {
  loading.value = true
  try {
    const { description, downloadDirectories, viewDirectories } = await queryDataRoleInfo(props.name)
    desc.value = description
    view.push(...viewDirectories?.map(v => v.id) || [])
    download.push(...downloadDirectories?.map(v => v.id) || [])
  }
  catch (_) { }
  finally {
    loading.value = false
  }
}

/**
 * 更新数据权限
 */
function updateDataRole() {
  Dialog.create({
    title: '更新确认',
    message: `该操作将更新 <b>${props.name}</b> 角色的权限，是否继续？`,
    cancel: true,
    html: true,
  }).onOk(async () => {
    loading.value = true
    try {
      const body: IRequest = {
        name: props.name,
        description: desc.value,
        viewableDirectoryIds: view,
        downloadableDirectoryIds: download,
      }

      const res = await upsertDataRole(body)
      if (res) {
        Notify.create({
          message: '更新成功',
          type: 'success',
        })
        $emit('update:modelValue', false)
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
  <q-dialog :model-value="modelValue" persistent>
    <q-card class="max-w-auto!" flex="~ col" p-6 relative min-w-375 h-0 gap-4 min-h-200>
      <header text-lg relative font-600>
        编辑权限
        <q-btn
          size="10px" icon="fas fa-times"
          absolute top-0 right-0 flat px-1
          @click="$emit('update:modelValue', false)"
        />
      </header>

      <main flex="~ 1 col" text-sm font-500 gap-6 h-0>
        <!-- 访问权限 -->
        <RoleTree
          :id="view"
          title="访问权限"
          :tree="tree"
        />
        <!-- 分割线 -->
        <div h-1px bg-grey-3 />
        <!-- 下载权限 -->
        <RoleTree
          :id="download"
          title="下载权限"
          :tree="tree"
        />
      </main>

      <footer flex gap-6 justify-end>
        <q-btn color="primary" w-28 h-10 outline rounded-2 label="取消" @click="$emit('update:modelValue', false)" />
        <q-btn color="primary" rounded-2 w-28 h-10 label="确认" @click="updateDataRole()" />
      </footer>
      <q-inner-loading :showing="loading" color="primary" />
    </q-card>
  </q-dialog>
</template>
