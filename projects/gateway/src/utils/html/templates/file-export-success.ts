import * as moment from 'moment'
import { HtmlTag } from '..'
import { APP_NAME } from '../assets/constants'
import { header } from '../blocks/header'
import { DANGER } from '../assets/color'
import footer from '../blocks/footer'

export function getFileExportSuccessHTML(exportInfo: {
  note?: string
  filename: string
  createdAt: Date | string
  fileSize?: string
}) {
  const { createdAt, fileSize } = exportInfo
  const time = moment(createdAt).format('YYYY年MM月DD HH:mm:ss')

  const subject = `【外发通过】${APP_NAME}文件外发`
  const tag = HtmlTag
    .create('div')
    .appendChild(
      header,
      HtmlTag
        .create('div')
        .indent()
        .appendChild(
          HtmlTag.create('span').text('您好！您于'),
          HtmlTag.create('span').text(time).color(DANGER).style({ fontWeight: '500' }),
          HtmlTag.create('span').text('申请外发的文件'),
          HtmlTag.create('span').text(exportInfo.filename).style({ fontWeight: '500' }).color(DANGER),
          fileSize ? HtmlTag.create('span').text(`（${fileSize}）`) : null,
          HtmlTag.create('span').text('已审核通过，请查看邮件“附件”进行下载。'),
        ),
    )
  if (exportInfo.note) {
    tag.appendChild(
      HtmlTag.create('div').indent().text('文件外发备注信息：'),
      HtmlTag
        .create('div')
        .text(exportInfo.note)
        .indent()
        .style({
          marginLeft: '2em',
          padding: '10px 20px',
          background: '#f5f5f5',
          borderRadius: '12px',
        }),
    )
  }
  tag.appendChild(
    footer,
  )
  const html = tag.raw()
  return { html, subject }
}
