const { $patch } = useRequest()
export function updateRootData(dataRootId: string, nameZH: string) {
  return $patch(`data/root/${dataRootId}`, { nameZH })
}
