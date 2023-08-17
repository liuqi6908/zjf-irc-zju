import { useRequest } from '../../composables/request'

const { $patch } = useRequest()

export function updateReference(dataDirectoryId: string, reference: string) {
  return $patch(`data/reference/${dataDirectoryId}`, { reference })
}
