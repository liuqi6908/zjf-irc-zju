const { $patch } = useRequest()
export function updateRootData(dataRootId: string, nameZH: string, nameEN: string) {
  return $patch(`data/root/${dataRootId}`, { nameEN, nameZH })
}
