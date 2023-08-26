import type { TabItem } from 'shared/component/base/tab/Tabs.vue'
import type { DataRoot, IDataDirectory, IDataRole } from 'zjf-types'
import { cloneDeep } from 'lodash-es'

const { $get } = useRequest()

const { userInfo } = useUser()
let rootTabList = reactive<TabItem[]>([])
const rootData = ref<IDataDirectory[]>([])
const allData = ref<IDataDirectory[]>([])
const databaseTab = ref<TabItem[]>([])
const loading = ref(false)
const verifyTree = ref([{ nameZH: '数据库类型', id: 'database', children: [] }])

export function useDataBase() {
  // const getProfile = async (relation = 'role.permissions,verification') => {
  //   const res = await getProfile(relation)
  //   if (res)
  //     userInfo.value = res
  // }
  // const getPermissionDownloadRole = async (permission = 'string') => {
  //   return await $get('data-permission/data-role/list', { permission })
  // }

  const downloadDescribeByRole = async (roleName: string) => {
    return await $get(`data-permission/data-role/${roleName}`)
  }

  const judgePermission = (roles?: IDataRole[]) => {
    if (!roles)
      return
    if (!userInfo.value)
      return
    if (roles.includes(userInfo.value?.dataRole))
      return true
    else
      return false
  }

  /** 获取指定分类的数据 */
  const getDataByRootId = async (dataRootId: DataRoot) => {
    loading.value = true
    const res = await $get<IDataDirectory[]>(`/data/list/${dataRootId}`)
    const tabs = [] as TabItem[]

    if (res[0].children) {
      res[0].children.forEach((item) => {
        // const view = judgePermission(item.viewDataRoles)
        // const download = judgePermission(item.downloadDataRoles)

        tabs.push({
          label: item.nameZH,
          id: item.id,
          children: item.children,
          nameEN: item.nameEN,
          isRequest: false,
          reference: item.reference,

        })
      })
    }
    databaseTab.value = cloneDeep(tabs)
    loading.value = false
  }

  const geRootData = async () => {
    loading.value = true
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
    loading.value = false
  }

  return {
    getDataByRootId,
    geRootData,
    rootData,
    allData,
    rootTabList,

    verifyTree,
    loading,
    databaseTab,
    downloadDescribeByRole,
  }
}
