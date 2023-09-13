import type { Body } from './putRootData'

const { $patch } = useRequest()

export function updateRootData(id: string, body: Body) {
  return $patch(`data/root/${id}`, body)
}
