import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDataPreview(dataDirectoryId: string) {
  return $get(
    `/data/preview/${dataDirectoryId}`,
    null,
    {
      headers: {
        message: false,
      },
    },
  )
}
