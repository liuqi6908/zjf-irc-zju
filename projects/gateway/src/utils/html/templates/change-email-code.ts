import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { header } from '../blocks/header'
import { APP_NAME } from '../assets/constants'
import { getVerifyCode, verifyCodeDesc } from '../blocks/verify-code'

const p1 = HtmlTag.create('p').text(`我们已收到您关于解除${APP_NAME}邮箱绑定的请求。您的验证码为：`)

/**
 * 更改邮箱的验证码
 * @param code
 */
export function getChangeEmailCodeHTML(code: string) {
  const subject = `【验证码】解除${APP_NAME}邮箱绑定`
  const html = HtmlTag.create('div')
    .appendChild(header)
    .appendChild(p1)
    .appendChild(getVerifyCode(code).style({ margin: '20px 0' }))
    .appendChild(verifyCodeDesc)
    .appendChild(footer)
    .raw()
  return { subject, html }
}
