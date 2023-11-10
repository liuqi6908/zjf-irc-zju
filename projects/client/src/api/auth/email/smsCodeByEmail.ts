import type { CodeAction } from 'zjf-types'

const { $post } = useRequest()

export function smsCodeByEmail(email: string, action: CodeAction, registerPlatform?: 0 | 1) {
  return $post<{ 'bizId': string }>('/email/code', { email, action, registerPlatform })
}
