const { $post } = useRequest()
const { isLogin } = useUser()

export function logout() {
  if (isLogin.value)
    return $post('/auth/logout', {})
}
