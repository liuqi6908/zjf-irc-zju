import * as mammoth from 'mammoth'
/** 解析 */

export function parseDocFile(url:string) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      const fileData = xhr.response
      const unit8Arr = new Uint8Array(fileData)
      mammoth.convertToHtml({ arrayBuffer: unit8Arr }).then((res) => {
        const html = res.value
        return html
      }).catch((err) => {
        console.error('error', err)
      })
    }
    xhr.send()
}

