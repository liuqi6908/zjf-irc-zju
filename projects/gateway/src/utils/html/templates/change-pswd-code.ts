import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { header } from '../blocks/header'
import { APP_NAME } from '../assets/constants'
import { getVerifyCode, verifyCodeDesc } from '../blocks/verify-code'

const p1 = HtmlTag.create('p').text(`我们已收到您关于重设${APP_NAME}帐号密码的请求。您的验证码为：`).indent()

/**
 * 更改密码的验证码
 * @param code
 */
export function getChangePswdCodeHTML(code: string) {
  const subject = `【验证码】更改${APP_NAME}帐号密码`
  const html = HtmlTag.create('div')
    .appendChild(header)
    .appendChild(p1)
    .appendChild(getVerifyCode(code).style({ margin: '20px 0' }))
    .appendChild(verifyCodeDesc)
    .appendChild(footer)
    .raw()
  return { subject, html }
}
