import { UploadType } from 'zjf-types'

const { $put } = useRequest()

/**
 * 上传表格 预览/下载 数据
 * @param type
 * @param id
 * @param file
 * @param tableId
 * @returns
 */
export function uploadTableData(type: UploadType, id: string, file: File, tableEn?: string) {
  const fromData = new FormData()
  fromData.append('file', file)

  const fileType = type === UploadType.PREVIEW ? 'csv' : 'zip'
  const filename = tableEn ? `${tableEn}.${fileType}` : file.name
  return $put(
    `/data/${type}/${id}/${filename}`,
    fromData,
    null,
    {
      headers: {
        message: false,
      },
    },
  )
}
