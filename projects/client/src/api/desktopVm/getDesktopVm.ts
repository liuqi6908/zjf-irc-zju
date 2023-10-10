const { $get } = useRequest()

export function getDesktopVm() {
  return $get<Record<string, number>>('desktop-vm')
}
