import { HtmlTag } from '..'
import { APP_NAME } from '../assets/constants'

export const header = HtmlTag.create('div').text(`尊敬的${APP_NAME}用户：`)
export const adminHeader = HtmlTag.create('div').text(`尊敬的${APP_NAME}管理老师：`)
