import { VerificationIdentify, VerificationStatus } from 'zjf-types'

/** 用户认证身份 */
const userIdentify = [
  { label: '学生', value: VerificationIdentify.STUDENT },
  { label: '教师', value: VerificationIdentify.TEACHER },
]

/** 用户认证状态 */
const userStatus = [
  { label: '已通过', value: VerificationStatus.APPROVED },
  { label: '已取消', value: VerificationStatus.CANCELLED },
  { label: '审核中', value: VerificationStatus.PENDING },
  { label: '已拒绝', value: VerificationStatus.REJECTED },
]

/** 用户注册平台 */
const userRegisterPlatform = [
  '智能云科研',
  '城市大脑',
]

export {
  userIdentify,
  userStatus,
  userRegisterPlatform,
}
