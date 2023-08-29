import type { VerificationHistory } from 'src/entities/verification'

import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { DANGER } from '../assets/color'
import { adminHeader } from '../blocks/header'
import { APP_NAME } from '../assets/constants'

function contentGetter(name: string) {
  return HtmlTag
    .create('div')
    .indent()
    .appendChild(
      HtmlTag.create('span').text('您好！新用户'),
      HtmlTag.create('span').text(`【${name}】`).color(DANGER),
      HtmlTag.create('span').text('已提交平台认证申请，请您及时登录管理后台审核/回复！'),
    )
}

const desc = HtmlTag.create('div').text('这是一封系统邮件，请勿直接回复！如有其他疑问，可微信扫码联系客服！').indent()

export function getNewVerificationHTML(verification: VerificationHistory) {
  const subject = `【认证审核】${APP_NAME}新的用户认证申请`
  const html = HtmlTag
    .create('div')
    .appendChild(
      adminHeader,
      contentGetter(verification.name),
      desc,
      footer,
    )
    .raw()
  return { subject, html }
}
