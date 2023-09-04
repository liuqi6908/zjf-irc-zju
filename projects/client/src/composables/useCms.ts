import { cmsConfig } from 'shared/constants'
import _ from 'lodash'
import { getCms } from '~/api/cms/getCms'

const allListProps = ref([])
const listProps = ref([])

export function useCms() {
  const currComponent = (pId: string, id: string): any => {
    const children = cmsConfig.find(i => i.id === pId)?.children
    const cmsObj = children?.find(i => i.id === id)
    if (cmsObj)
      return cmsObj.component
  }

  const cmsProps = async (id: string) => {
    const res = await getCms<any>(id)
    const clone = _.cloneDeep(res.json)

    const currCmsArr = [] as any[]
    clone.forEach((item: any) => {
      currCmsArr.push(item)
    })

    return currCmsArr
  }

  return {
    allListProps,
    listProps,
    currComponent,
    cmsProps,
  }
}
