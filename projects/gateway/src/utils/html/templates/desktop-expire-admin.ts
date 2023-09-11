import * as moment from 'moment'
import type { Desktop } from 'src/entities/desktop'

import { getUserName } from 'src/utils/get-user-name'
import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { APP_NAME } from '../assets/constants'
import { adminHeader } from '../blocks/header'
import { DANGER } from './../assets/color'

export function getDesktopExpireAdminHTML(desktop: Desktop) {
  const subject = `【到期提醒】${APP_NAME}账号即将到期`
  const expiredAt = moment(desktop.expiredAt).format('YYYY-MM-DD HH:mm:ss')
  const html = HtmlTag
    .create('div')
    .appendChild(
      adminHeader,
      HtmlTag
        .div()
        .indent()
        .appendChild(
          HtmlTag.span('用户【'),
          HtmlTag.span(getUserName(desktop.user)).color(DANGER).bold(500),
          HtmlTag.span('】（云桌面账号【'),
          HtmlTag.span(`【${desktop.account}】`).color(DANGER).bold(500),
          HtmlTag.span('）'),
          HtmlTag.span('即将于'),
          HtmlTag.span(`【${expiredAt}】`).color(DANGER).bold(500),
          HtmlTag.span('到期，请及时处理！'),
        ),
      HtmlTag.div().indent().text('这是一封系统邮件，请勿直接回复！如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()
  return { html, subject }
}
