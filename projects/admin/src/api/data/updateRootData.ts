import type { Body } from './putRootData'

const { $patch } = useRequest()

export function updateRootData(id: string, body: Omit<Body, 'id'>) {
  return $patch(`data/root/${id}`, body)
}
