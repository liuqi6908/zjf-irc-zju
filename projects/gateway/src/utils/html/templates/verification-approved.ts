import type { VerificationHistory } from 'src/entities/verification'

import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { header } from '../blocks/header'
import { APP_NAME } from '../assets/constants'

const desc1 = HtmlTag
  .create('div')
  .text('您好！您的用户认证申请已经审核通过！可登录平台查看详细云桌面使用/申请方式！')
  .indent()
const desc2 = HtmlTag
  .create('div')
  .text('这是一封系统邮件，请勿直接回复。如有其他疑问，可微信扫码联系客服！')
  .indent()

export function getVerificationApprovedHTML(_: VerificationHistory) {
  const subject = `【认证通过】${APP_NAME}用户认证申请`
  const html = HtmlTag
    .create('div')
    .appendChild(
      header,
      desc1,
      desc2,
      footer,
    )
    .raw()
  return { subject, html }
}
