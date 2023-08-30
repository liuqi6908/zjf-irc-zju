import { HtmlTag } from '..'
import { DANGER } from '../assets/color'
import { APP_NAME } from '../assets/constants'
import footer from '../blocks/footer'
import { adminHeader } from '../blocks/header'

export function getDesktopRequestHTML({ name }) {
  const subject = `【审核通知】${APP_NAME}新的云桌面申请`
  const html = HtmlTag
    .create('div')
    .appendChild(
      adminHeader,
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！用户'),
          HtmlTag.create('span').text(`【${name}】`).style({ fontWeight: '500' }).color(DANGER),
          HtmlTag.create('span').text('已提交云桌面的使用申请，请您及时登录管理后台审核/回复！'),
        ),
      HtmlTag.create('div').indent().text('这是一封系统邮件，请勿直接回复！如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()
  return { html, subject }
}
