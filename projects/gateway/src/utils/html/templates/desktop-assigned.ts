import type { Desktop } from 'src/entities/desktop'
import { getUserName } from 'src/utils/get-user-name'
import { APP_NAME } from '../assets/constants'
import { HtmlTag } from '..'
import { header } from '../blocks/header'
import { DANGER } from '../assets/color'
import footer from '../blocks/footer'

function importantInfo(key: string, value: string) {
  return HtmlTag.create('div').appendChild(
    HtmlTag.create('span').text(`${key}: `).style({ fontWeight: '500' }),
    HtmlTag.create('span').text(`${value}`).style({
      background: DANGER,
      padding: '2px 4px',
      borderRadius: '4px',
      fontWeight: '500',
      color: '#fff',
    }),
  )
}

export function getDesktopConnectInfo(desktop: Desktop) {
  const { accessUrl, password, account } = desktop
  return HtmlTag
    .create('div')
    .appendChild(
      importantInfo('云桌面登录地址', accessUrl).indent(),
      importantInfo('云桌面登录账号', account).indent(),
      importantInfo('云桌面初始密码', password).indent(),

      HtmlTag.create('div').indent().text('登录云桌面的使用教程请查看智能云科研平台的常见问题解答板块。'),
      HtmlTag.create('div').indent().text('请务必保管好上述信息，以防外泄，若他人知悉您的账号密码，将有权登录并查看该账号上所有信息！').color(DANGER).style({ fontWeight: '500' }),
    )
}

export function getDesktopAssignedHTML(desktop: Desktop) {
  const subject = `【云桌面开通通知】${APP_NAME}云桌面开通提示`
  const html = HtmlTag
    .create('div')
    .appendChild(
      header,
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！用户'),
          HtmlTag.create('span').text(`【${getUserName(desktop.user)}】`).color(DANGER).style({ fontWeight: '500' }),
          HtmlTag.create('span').text('您提交的云桌面申请已经通过，管理员已经为您分配好云桌面。'),
        ),
      getDesktopConnectInfo(desktop),
      HtmlTag.create('div').indent().text('如有其他疑问，可微信扫码联系客服！'),
      footer,
    )
    .raw()

  return { subject, html }
}
