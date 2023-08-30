import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopHostList() {
  return $get('desktop-host')
}
