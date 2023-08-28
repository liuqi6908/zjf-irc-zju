import type { IFileExportLarge, IQueryDto } from '../../../../../packages/zjf-types/dist/esm'
import { useRequest } from '../../composables/request'

const { $post } = useRequest()
export function getOwnExportLg(options: IQueryDto<IFileExportLarge>) {
  return $post('export-lg/query/own', options)
}
