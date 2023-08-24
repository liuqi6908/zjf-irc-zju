import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import type { DataRoot, IDataDirectory } from 'zjf-types'
import { cloneDeep } from 'lodash-es'

const { $get } = useRequest()
let rootTabList = reactive<TabItem[]>([])
const rootData = ref<IDataDirectory[]>([])
const allData = ref<IDataDirectory[]>([])
const loading = ref()
const verifyTree = ref([{ nameZH: '数据库类型', id: 'database', children: [] }])

export function useDataBase() {
  const getPermissionDownloadRole = async (permission = 'string') => {
    return await $get('data-permission/data-role/list', { permission })
  }

  /** 获取指定分类的数据 */
  const getDataByRootId = async (dataRootId: DataRoot) => {
    if (!dataRootId)
      return
    return await $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
  }

  const geRootData = async () => {
    rootData.value = await $get<IDataDirectory[]>('/data/root/list')

    if (rootData.value && rootData.value.length) {
      const rootList = [] as TabItem[]
      rootData.value.forEach(async (item) => {
        rootList.push({
          id: item.id,
          label: item.nameZH,
          isRequest: false,
        })
      })

      rootTabList = cloneDeep(rootList)
    }
  }
  // const deepFreeze = (obj) => {
  //   if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
  //     Object.freeze(obj)
  //     Object.getOwnPropertyNames(obj).forEach(prop => deepFreeze(obj[prop]))
  //   }
  //   return obj
  // }

  const fetchAllData = async () => {
    loading.value = true

    if (verifyTree.value[0].children && verifyTree.value[0].children.length)
      return

    await geRootData().finally(() => {
      if (rootData.value && rootData.value.length) {
        rootData.value.forEach(async (item) => {
          const res = await getDataByRootId(item.id as DataRoot)

          if (!res)
            return

          for (const dataDirectory of res) {
            dataDirectory.lazy = true
            verifyTree.value[0].children.push(dataDirectory)
          }
        })
      }
    })

    // deepFreeze(verifyTree.value)
    loading.value = false
  }

  return {
    getDataByRootId,
    geRootData,
    rootData,
    allData,
    rootTabList,
    fetchAllData,
    verifyTree,
    loading,
    getPermissionDownloadRole,
  }
}
