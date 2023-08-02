import { responseParamsError } from '../response/validate-exception-factory'

/**
 * 检查参数中的 email 和 account 是否至少有一个，如果没有，给客户端返回错误信息
 * @param info
 * @returns
 */
export function emailAccountAtLeastOne(info: Record<'email' | 'account' | string, any>) {
  if (info.email || info.account)
    return

  responseParamsError([{
    property: 'email|account',
    constraints: { 'email|account': '邮箱或账号至少需要填写一个' },
  }])
}
