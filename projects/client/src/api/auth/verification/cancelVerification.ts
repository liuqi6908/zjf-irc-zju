const { $delete } = useRequest()
export function cancelVerification(verificationId: string) {
  return $delete(`verification/cancel/${verificationId}`)
}
