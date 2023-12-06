import type { IDataDirectory } from 'zjf-types'

const { $get } = useRequest()

export interface Node {
  id: string
  nameZH: string
  nameEN: string
  reference?: string
  preview?: boolean
  download?: boolean
  children?: Node[]
}

/** 加载中 */
const loading = ref(false)
/** 数据大类 */
const rootList = ref<IDataDirectory[]>()
/** 分类数据 */
const rootData = ref<Node[]>()

export function useDatabase() {
  /**
   * 获取指定分类的数据
   * @param id
   * @returns
   */
  async function getDataByRootId(id: string) {
    rootData.value = []
    if (id) {
      loading.value = true
      rootData.value = await $get<Node[]>(`/data/list/${id}`)
      loading.value = false
    }
  }

  /**
   * 获取所有数据大类
   */
  async function getRootList() {
    loading.value = true
    rootList.value = await $get<IDataDirectory[]>('/data/root/list')
    loading.value = false
  }

  return {
    getDataByRootId,
    getRootList,
    loading,
    rootList,
    rootData,
  }
}
