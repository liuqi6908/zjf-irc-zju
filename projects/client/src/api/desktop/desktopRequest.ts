const { $put } = useRequest()
export function desktopRequest(duration: number, attachments: string[]) {
  return $put('desktop-request', { duration, attachments })
}
