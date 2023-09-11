import * as moment from 'moment'
import type { Desktop } from 'src/entities/desktop'

import { getUserName } from 'src/utils/get-user-name'
import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { APP_NAME } from '../assets/constants'
import { header } from '../blocks/header'
import { DANGER } from './../assets/color'

export function getDesktopExpireUserHTML(desktop: Desktop) {
  const subject = `【到期提醒】${APP_NAME}账号即将到期`
  const expiredAt = moment(desktop.expiredAt).format('YYYY-MM-DD HH:mm:ss')
  const html = HtmlTag
    .create('div')
    .appendChild(
      header,
      HtmlTag
        .div()
        .indent()
        .appendChild(
          HtmlTag.span('您的云桌面账号'),
          HtmlTag.span('用户【'),
          HtmlTag.span(getUserName(desktop.user)).color(DANGER).bold(500),
          HtmlTag.span('】（云桌面账号【'),
          HtmlTag.span(`【${desktop.account}】`).color(DANGER).bold(500),
          HtmlTag.span('）'),
          HtmlTag.span('即将于'),
          HtmlTag.span(`【${expiredAt}】`).color(DANGER).bold(500),
          HtmlTag.span('到期，请及时外发您的研究成果！云桌面到期后系统将自动删除云桌面上的所有数据，以便分配给其他等待的用户使用！到期后您可以再次申请云桌面的使用权限！'),
        ),
      HtmlTag.div().indent().text('云桌面回收后，该账号上残留文件将会被全部清除，请您知悉！').bold(500).color(DANGER),
      HtmlTag.div().indent().text('这是一封系统邮件，请勿直接回复！如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()
  return { html, subject }
}
