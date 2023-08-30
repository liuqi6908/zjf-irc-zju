import * as moment from 'moment'

import footer from '../blocks/footer'

import { HtmlTag } from '..'
import { DANGER } from '../assets/color'
import { header } from '../blocks/header'
import { APP_NAME } from '../assets/constants'

export function getFileExportRejectedHTML(config: {
  time: Date | string
  filename: string
  reason: string
}) {
  const { time, filename, reason } = config

  const timeReadable = moment(time).format('YYYY年MM月DD HH:mm:ss')
  const subject = `【外发驳回】${APP_NAME}文件外发申请`

  const html = HtmlTag
    .create('div')
    .appendChild(
      header,
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！您于'),
          HtmlTag.create('span').text(timeReadable).style({ fontWeight: '500' }).color(DANGER),
          HtmlTag.create('span').text('申请外发的文件'),
          HtmlTag.create('span').text(`【${filename}】未通过审核`).style({ fontWeight: '500' }).color(DANGER),
          HtmlTag.create('span').text('。'),
        ),
      reason
        ? HtmlTag.create('div').appendChild(
          HtmlTag.create('div').indent().text('未通过审核原因如下：'),
          HtmlTag.create('div').style({ marginLeft: '2em' }).text(reason).style({
            padding: '10px 20px',
            background: '#f5f5f5',
            borderRadius: '12px',
          }),
        )
        : null,
      HtmlTag.create('div').indent().text('请您根据审核意见，修改您的外发文件后重新申请外发！'),
      footer,
    )
    .raw()
  return { html, subject }
}
