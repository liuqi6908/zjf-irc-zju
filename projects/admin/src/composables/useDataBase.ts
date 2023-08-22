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
  /** 获取指定分类的数据 */
  const getDataByRootId = async (dataRootId: DataRoot) => {
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

  const fetchAllData = async () => {
    loading.value = true
    await geRootData()
    if (rootData.value && rootData.value.length) {
      rootData.value.forEach(async (item) => {
        const res = await getDataByRootId(item.id as DataRoot)

        if (!res)
          return

        for (const dataDirectory of res) {
          const clone = cloneDeep(dataDirectory)
          clone.lazy = true
          verifyTree.value[0].children.push(clone)
        }
      })
    }
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
  }
}
