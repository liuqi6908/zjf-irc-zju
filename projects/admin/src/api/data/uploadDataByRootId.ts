const { $put } = useRequest()

export function uploadDataByRootId(id: string, file: FormData, clear = true) {
  return $put(`data/upload/${id}`, file, { clear })
}
