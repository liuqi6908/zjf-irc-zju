export enum VerificationIdentify {
  /** 校内研究人员 */
  INTERNAL_RESEARCHER = "internal_researcher",
  /** 校外研究人员 */
  EXTERNAL_RESEARCHER = "external_researcher",
  /** 校内学生 */
  INTERNAL_STUDENT = "internal_student",
  /** 校外学生 */
  EXTERNAL_STUDENT = "external_student",
  /** 校内教师 */
  INTERNAL_TEACHER = "internal_teacher",
  /** 校外教师 */
  EXTERNAL_TEACHER = "external_teacher",
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
  [VerificationIdentify.INTERNAL_RESEARCHER]: "校内研究人员",
  [VerificationIdentify.EXTERNAL_RESEARCHER]: "校外研究人员",
  [VerificationIdentify.INTERNAL_STUDENT]: "校内学生",
  [VerificationIdentify.EXTERNAL_STUDENT]: "校外学生",
  [VerificationIdentify.INTERNAL_TEACHER]: "校内教师",
  [VerificationIdentify.EXTERNAL_TEACHER]: "校外教师",
}

export const verificationStatusDescriptions = {
  [VerificationStatus.PENDING]: "审核中",
  [VerificationStatus.APPROVED]: "已通过",
  [VerificationStatus.REJECTED]: "已拒绝",
  [VerificationStatus.CANCELLED]: "已取消",
}