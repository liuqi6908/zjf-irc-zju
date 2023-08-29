import { useRequest } from '../../composables/request'

const { $delete } = useRequest()

export function resetApply(
  verificationId: string,
) {
  return $delete(`/verification/cancel/${verificationId}`)
}
