import { VerificationStatus } from 'zjf-types'

/** 用户认证状态 */
const userStatus = [
  { label: '已通过', value: VerificationStatus.APPROVED },
  { label: '已取消', value: VerificationStatus.CANCELLED },
  { label: '审核中', value: VerificationStatus.PENDING },
  { label: '已拒绝', value: VerificationStatus.REJECTED },
]

export {
  userStatus,
}
