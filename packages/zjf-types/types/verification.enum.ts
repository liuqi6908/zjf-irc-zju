export enum VerificationIdentify {
  /** 教师 */
  TEACHER = "teacher",
  /** 学生 */
  STUDENT = "student",
}

export enum VerificationStatus {
  /** 审核中 */
  PENDING = "pending",
  /** 已通过 */
  APPROVED = "approved",
  /** 已拒绝 */
  REJECTED = "rejected",
  /** 已取消 */
  CANCELLED = "cancelled",
}

export const verificationIdentifyDescriptions = {
  [VerificationIdentify.TEACHER]: "教师",
  [VerificationIdentify.STUDENT]: "学生",
}

export const verificationStatusDescriptions = {
  [VerificationStatus.PENDING]: "审核中",
  [VerificationStatus.APPROVED]: "已通过",
  [VerificationStatus.REJECTED]: "已拒绝",
  [VerificationStatus.CANCELLED]: "已取消",
}