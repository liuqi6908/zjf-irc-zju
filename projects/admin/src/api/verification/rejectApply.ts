import { useRequest } from '../../composables/request'

const { $patch } = useRequest()

export function rejectApply(
  verificationId: string,
  reason: string,
) {
  return $patch(`/verification/reject/${verificationId}`, { reason })
}
