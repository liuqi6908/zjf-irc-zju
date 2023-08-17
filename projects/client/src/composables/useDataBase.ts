import type { DataRoot, IDataDirectory } from 'zjf-types'

const { $get } = useRequest()
const rootData = ref<IDataDirectory[]>()
const allData = ref<IDataDirectory[]>()

export function useDataBase() {
  const geRootData = async () => {
    rootData.value = await $get<IDataDirectory[]>('/data/list/root')
  }

  /** 获取指定分类的数据 */
  const getDataByRootId = async (dataRootId: DataRoot) => {
    allData.value = await $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
  }

  return {
    getDataByRootId,
    geRootData,
    rootData,
    allData,
  }
}
