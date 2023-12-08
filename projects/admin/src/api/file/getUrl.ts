const { $getUri } = useRequest()

export function getUrlByToken(url: string, params?: any, token = authToken.value) {
  return $getUri(`${url}?token=${token}`, params)
}
