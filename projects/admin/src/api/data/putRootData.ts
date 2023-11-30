export interface Body {
  id: string
  nameZH: string
  nameEN: string
  order?: number
}

const { $put } = useRequest()

export function putRootData(body: Body) {
  return $put('data/root', body)
}
