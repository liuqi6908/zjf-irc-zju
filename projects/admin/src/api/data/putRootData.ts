const { $put } = useRequest()
export function putRootData(nameZH: string, nameEN: string) {
  return $put('data/root', { nameZH, nameEN })
}
