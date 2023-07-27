import { responseParamsError } from '../response/validate-exception-factory'

/**
 * 检查参数中的 email 和 phone 是否至少有一个，如果没有，给客户端返回错误信息
 * @param info
 * @returns
 */
export function emailPhoneAtLeastOne(info: Record<'email' | 'phone' | string, any>) {
  if (info.email || info.phone)
    return

  responseParamsError([{
    property: 'email|phone',
    constraints: { 'email|phone': '邮箱或手机号码至少需要填写一个' },
  }])
}
