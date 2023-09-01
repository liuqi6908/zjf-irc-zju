import type { CodeAction } from 'zjf-types'
import { useRequest } from '../../../composables/request'

const { $post } = useRequest()

export function smsCodeByEmail(email: string, action: CodeAction) {
  return $post<{ 'bizId': string }>('/email/code', { email, action })
}
