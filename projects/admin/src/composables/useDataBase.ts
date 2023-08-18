import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import type { DataRoot, IDataDirectory } from 'zjf-types'

const { $get } = useRequest()
const rootTabList = reactive<TabItem[]>([])
const rootData = ref<IDataDirectory[]>()
const allData = ref<IDataDirectory[]>()

export function useDataBase() {
  /** 获取指定分类的数据 */
  const getDataByRootId = async (dataRootId: DataRoot) => {
    return await $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
  }

  const geRootData = async (alldata?: boolean) => {
    rootData.value = await $get<IDataDirectory[]>('/data/list/root')

    if (rootData.value && rootData.value.length) {
      rootData.value.forEach(async (item) => {
        rootTabList.push({
          id: item.id,
          label: item.nameZH,
          isRequest: false,
        })

        if (!alldata)
          return
        const res = await getDataByRootId(item.id as DataRoot)

        // for (const res of alldata) {
        //   // allData.value(*)
        // }
      })
    }
  }

  return {
    getDataByRootId,
    geRootData,
    rootData,
    allData,
    rootTabList,
  }
}
