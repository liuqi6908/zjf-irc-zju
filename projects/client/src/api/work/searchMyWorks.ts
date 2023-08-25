import type { IQueryDto, IVerificationHistory } from '../../../../../packages/zjf-types/dist/esm'
import { useRequest } from '../../../../admin/src/composables/request'

const { $post } = useRequest()

export function searchMyWorks(options: IQueryDto<IVerificationHistory>) {
  return $post('work/query/own', options)
}
