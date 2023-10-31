import type { IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { fileToFormData } from 'zjf-utils'
import { getPublicFileUrl, putPublicFile } from '~/api/file/handlePublicFile'

/** toolBar配置 */
const toolbarConfig: Partial<IToolbarConfig> = {}

/**
 * 自定义校验链接
 * @param _
 * @param url
 */
function customCheckLinkFn(_: string, url: string): string | boolean | undefined {
  if (!url)
    return

  if (url.indexOf('http') !== 0)
    return '链接必须以 http/https 开头'

  return true
}

/**
 * 自定义转换链接 url
 * @param url
 */
function customParseLinkUrl(url: string): string {
  if (url.indexOf('http') !== 0)
    return `http://${url}`

  return url
}

/** url校验 */
const insertLink = {
  checkLink: customCheckLinkFn,
  parseLinkUrl: customParseLinkUrl,
}

const lineHeight = {
  lineHeight: 1.2,
}

/** 图片上传 */
type InsertFnType = (url: string) => void
const uploadImage = {
  async customUpload(file: File, insertFn: InsertFnType) {
    const path = 'cms'
    const formData = fileToFormData(file)
    const fileName = `${generateRandomString()}.${file.name.split('.').pop()}`
    const res = await putPublicFile(path, fileName, formData)

    if (res) {
      const url = await getPublicFileUrl(path, fileName)
      // 插入图片
      insertFn(url)
    }
  },
}

/** menu配置 */
const editorConfig: Partial<IEditorConfig> = {
  MENU_CONF: {
    uploadImage,
    uploadVideo: uploadImage,
    insertLink,
    lineHeight,
  },
}

export { toolbarConfig, editorConfig }
