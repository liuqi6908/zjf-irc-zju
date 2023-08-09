import { useRequest } from '../../composables/request'

const { $patch } = useRequest()

export function approveApply(
  verificationId: string,
) {
  return $patch(`/verification/approve/${verificationId}`)
}
