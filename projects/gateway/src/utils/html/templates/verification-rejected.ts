import type { VerificationHistory } from 'src/entities/verification'

import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { DANGER } from '../assets/color'
import { header } from '../blocks/header'
import { APP_NAME } from '../assets/constants'

const desc1 = HtmlTag
  .create('div')
  .indent()
  .appendChild(
    HtmlTag.create('span').text('您好！您的用户认证申请'),
    HtmlTag.create('span').text('未通过审核').color(DANGER),
    HtmlTag.create('span').text('。'),
  )
const desc2 = HtmlTag
  .create('div')
  .text('未通过审核原因如下')
  .indent()

function reasonRenderer(content: string) {
  return HtmlTag
    .create('div')
    .text(content)
    .indent()
    .style({
      marginLeft: '2em',
      padding: '10px 20px',
      background: '#f5f5f5',
      borderRadius: '12px',
    })
}

const desc3 = HtmlTag
  .create('div')
  .text('请您根据审核意见，修改您的认证材料后重新申请认证！')
  .indent()

export function getVerificationRejectedHTML(verification: VerificationHistory) {
  const subject = `【认证失败】${APP_NAME}用户认证申请`
  const html = HtmlTag
    .create('div')
    .appendChild(
      header,
      desc1,
      desc2,
      reasonRenderer(verification.rejectReason),
      desc3,
      footer,
    )
    .raw()
  return { subject, html }
}
