import type { Desktop } from 'src/entities/desktop'
import { getUserName } from 'src/utils/get-user-name'
import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { DANGER } from '../assets/color'
import { APP_NAME } from '../assets/constants'
import { adminHeader } from '../blocks/header'

export function getNewExportLgHTML(desktop: Desktop) {
  const subject = `【审核通知】${APP_NAME}新的大文件外发申请`
  const html = HtmlTag
    .create('div')
    .appendChild(adminHeader)
    .appendChild(
      HtmlTag.create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！云桌面账号 '),
          HtmlTag.span('用户【'),
          HtmlTag.span(getUserName(desktop.user)).color(DANGER).bold(500),
          HtmlTag.span('】（云桌面账号【'),
          HtmlTag.span(`【${desktop.account}】`).color(DANGER).bold(500),
          HtmlTag.span('）'),
          HtmlTag.create('span').text('有一条新的大文件外发申请，请您及时登录管理后台审核/回复！'),
        ),
      HtmlTag.create('div').indent().text('这是一封系统邮件，请勿直接回复！如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()
  return { subject, html }
}
