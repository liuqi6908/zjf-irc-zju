import { UploadType } from 'zjf-types'
import type { IDataDirectory } from 'zjf-types'
import { tableFileIsExist } from '~/api/file'

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
      try {
        rootData.value = await $get<Node[]>(`/data/list/${id}`)
      }
      catch (_) {}
      finally {
        loading.value = false
        if (rootData.value[0]?.children?.length) {
          const { id, children } = rootData.value[0]
          children.forEach((database) => {
            if (database.children?.length) {
              database.children.forEach((b_database) => {
                if (b_database.children?.length) {
                  b_database.children.forEach((part) => {
                    if (part.children?.length) {
                      part.children.forEach(async (table) => {
                        const { nameEN } = table
                        table.preview = await tableFileIsExist(UploadType.PREVIEW, id, nameEN)
                        table.download = await tableFileIsExist(UploadType.DOWNLOAD, id, nameEN)
                      })
                    }
                  })
                }
              })
            }
          })
        }
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
  }
}
