/**
 * 展开json对象
 * @param json
 * @returns
 */
export function flattenJSON(json: any): Record<string, any> {
  let result: Record<string, any> = {}

  for (const key in json) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      if (typeof json[key] === 'object' && !Array.isArray(json[key])) {
        const nestedJson = flattenJSON(json[key])
        result = { ...result, ...nestedJson }
      }
      else {
        result[key] = json[key]
      }
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
