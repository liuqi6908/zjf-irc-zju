const { $patch } = useRequest()

export function changePasswordBySms(email: string, password: string, bizId: string, code: string, registerPlatform: 0 | 1) {
  return $patch('user/own/password/code', { email, bizId, code, password, registerPlatform })
}
