import type { IUpdateDesktopInterface } from 'zjf-types'
import { useRequest } from '../../composables/request'

const { $patch } = useRequest()

export function updateDesktop(desktopId: string, options: IUpdateDesktopInterface) {
  return $patch(`desktop/query${desktopId}`, options)
}
