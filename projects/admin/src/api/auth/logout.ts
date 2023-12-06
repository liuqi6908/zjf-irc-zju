const { $post } = useRequest()

export function logout() {
  if (authToken.value)
    return $post('/auth/logout', {})
}
