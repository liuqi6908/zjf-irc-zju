import type { ICreateDesktopBodyDto } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $put } = useRequest()

export function createDesktop(options: ICreateDesktopBodyDto) {
  return $put('desktop', options)
}
