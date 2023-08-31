import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDesktopVm() {
  return $get('desktop-vm')
}
