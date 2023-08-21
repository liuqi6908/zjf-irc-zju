import { useRequest } from '../../composables/request'

const { $get } = useRequest()

export function getDataRolesList(permission = 'string') {
  return $get('data-permission/data-role/list', { permission })
}
