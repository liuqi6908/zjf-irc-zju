import { Dialog } from 'quasar'
import { getUrlByToken } from '~/api/file/getUrl'

/**
 * 展开json对象
 * @param json
 * @returns
 */
export function flattenJSON(json: any, prefix = '', result?: Record<string, any>): Record<string, any> {
  if (!result)
    result = {}
  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      const value = json[key]
      const newKey = prefix ? `${prefix}.${key}` : key

      if (typeof value === 'object' && !Array.isArray(value))
        flattenJSON(value, newKey, result)
      else
        result[newKey] = value
    }
  }
  return result
}

/**
 * 根据二进制文件流下载文件
 * @param stream
 * @param filename
 */
export function downloadFile(stream: string, filename: string) {
  const blob = new Blob([stream], { type: 'application/octet-stream' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  // 清理创建的对象 URL
  URL.revokeObjectURL(url)
}

/**
 * 查看证明材料
 * @param images
 * @param id
 * @param url
 */
export function checkAttachment(images: Array<string>, id: string, url = 'verify') {
  let message = ''

  if (images && images.length) {
    images.forEach((filename: string) => {
      const src = getUrlByToken(`file/private/${url}/${id}/${filename}`)
      message += `<img src="${src}"><a href="${src}" download>点击下载文件</a><br/>`
    })
  }
  else {
    message = '当前用户暂无认证材料'
  }

  Dialog.create({
    title: '查看认证材料',
    message,
    html: true,
  })
}

/**
 * 生成随机字符串
 * @param len
 */
export function generateRandomString(len = 12): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&'
  let result = ''

  for (let i = 0; i < len; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}
