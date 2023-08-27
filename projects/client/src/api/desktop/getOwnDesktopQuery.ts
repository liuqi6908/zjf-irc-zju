const { $get } = useRequest()
export function getOwnDesktopQuery() {
  return $get('desktop-request/own')
}
