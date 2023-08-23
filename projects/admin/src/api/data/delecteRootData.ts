const { $delete } = useRequest()
export function deleteRootData(dataRootId: string) {
  return $delete(`data/root/${dataRootId}`)
}
