import type { IDataDirectory } from 'zjf-types'
import { getFolderFiles } from '~/api/file'

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
/** 数据大类中所有的下载文件 */
const downloadFiles = ref<Array<string | undefined>>([])
/** 数据大类中所有的样例文件 */
const previewFiles = ref<Array<string | undefined>>([])

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
      try {
        rootData.value = await $get<Node[]>(`/data/list/${id}`)
        if (rootData.value[0]?.children?.length) {
          const { id } = rootData.value[0]

          const _getFileNames = (arr: { name: string }[]) => {
            return arr.map(({ name }) => {
              return name.split('/').pop()?.split('.').shift()
            }).filter(v => v)
          }

          downloadFiles.value = _getFileNames(await getFolderFiles({
            bucket: 'data',
            path: `/download/${id}/`,
          }))
          previewFiles.value = _getFileNames(await getFolderFiles({
            bucket: 'data',
            path: `/preview/${id}/`,
          }))
        }
      }
      catch (_) {}
      finally {
        loading.value = false
      }
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
    downloadFiles,
    previewFiles,
  }
}
