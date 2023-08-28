import type { IFileExportSmall, IQueryDto } from '../../../../../packages/zjf-types/dist/esm'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()
export function getOwnExportSm(options: IQueryDto<IFileExportSmall>) {
  return $post('export-sm/query/own', options)
}
