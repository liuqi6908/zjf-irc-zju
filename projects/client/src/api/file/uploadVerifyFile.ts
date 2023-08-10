import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function uploadVerifyFile(filename: string, file: FormData) {
  return $put<string>(`/file/private/verify/${filename}`,
    file,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
    },
  )
}
