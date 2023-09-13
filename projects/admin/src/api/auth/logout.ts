const { $post } = useRequest()

export function logout() {
  return $post('/auth/logout', {})
}
