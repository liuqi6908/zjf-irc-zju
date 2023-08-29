import { HtmlTag } from '..'
import { DANGER, PRIMARY } from '../assets/color'

export function getVerifyCode(content: string) {
  return HtmlTag
    .create('div')
    .style({
      fontSize: '2rem',
      color: PRIMARY,
      fontWeight: 'bold',
      padding: '5px 10px',
      background: '#f5f5f5',
      borderRadius: '5px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    })
    .text(content)
}

const p = HtmlTag.create('p').text('温馨提示')
const ol = HtmlTag.create('ol')
const li1_span1 = HtmlTag.create('span').text('如果您并未请求此验证码，则可能是他人正在尝试修改您的智能云科研平台帐号所绑邮箱地址。')
const li1_span2 = HtmlTag.create('span').text('请勿将此验证码转发给或提供给任何人。').color(DANGER)
const li1 = HtmlTag.create('li').appendChild(li1_span1, li1_span2)
const li2 = HtmlTag.create('li').text('如果验证码失效，请登陆页面到个人账户重新获取。')
const li3 = HtmlTag.create('li').text('如果不是您本人操作，请忽略此邮件。')
const li4 = HtmlTag.create('li').text('这是一封系统邮件，请勿直接回复。')

ol.appendChild(li1, li2, li3, li4)

export const verifyCodeDesc = HtmlTag.create('div').appendChild(p, ol)
