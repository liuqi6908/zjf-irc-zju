/**
 * 发送验证码的目的
 */
export enum CodeAction {
  /** 注册 */
  REGISTER = 'register',
  /** 登录 */
  LOGIN = 'login',
  /** 修改密码 */
  CHANGE_PASSWORD = 'change-password',
}

export const codeActionDescriptions: Record<CodeAction, string> = {
  [CodeAction.REGISTER]: '注册',
  [CodeAction.LOGIN]: '登录',
  [CodeAction.CHANGE_PASSWORD]: '修改密码',
}