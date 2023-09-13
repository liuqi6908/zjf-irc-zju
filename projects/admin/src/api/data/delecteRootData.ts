const { $delete } = useRequest()

export function deleteRootData(id: string) {
  return $delete(`data/root/${id}`)
}
