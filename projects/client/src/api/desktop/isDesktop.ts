import { useRequest } from '~/composables/request'

const { $get } = useRequest()

export function isDesktop() {
  return $get('desktop/is')
}
