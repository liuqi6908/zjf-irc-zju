import type { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { fileToFormData } from 'zjf-utils'
import { getPublicFileUrl, putPublicFile } from '~/api/file/handlePublicFile'

/** toolBar配置 */
const toolbarConfig: Partial<IToolbarConfig> = {

}

// 自定义校验链接
function customCheckLinkFn(text: string, url: string): string | boolean | undefined {
  // function customCheckLinkFn(text, url) {

  if (!url)
    return

  if (url.indexOf('http') !== 0)
    return '链接必须以 http/https 开头'

  return true
}

// 自定义转换链接 url
function customParseLinkUrl(url: string): string {
  // function customParseLinkUrl(url) {

  if (url.indexOf('http') !== 0)
    return `http://${url}`

  return url
}

/** url校验 */
const insertLink = {
  checkLink: customCheckLinkFn,
  parseLinkUrl: customParseLinkUrl,
}

/** 图片上传 */
type InsertFnType = (url: string) => void
const uploadImage = {
  async customUpload(file: File, insertFn: InsertFnType) {
    const path = 'cms'
    const formData = fileToFormData(file)
    const res = await putPublicFile(path, file.name, formData)

    if (res) {
      const url = await getPublicFileUrl(path, file.name)
      // 插入图片
      insertFn(url)
    }
  },
}

/** menu配置 */
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage,
    insertLink,
  },
}

// type ImageElement = SlateElement & {
//   src: string
//   alt: string
//   url: string
//   href: string
// }

export { toolbarConfig, editorConfig }
