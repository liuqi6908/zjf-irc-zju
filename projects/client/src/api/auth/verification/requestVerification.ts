import type { ICreateVerificationBodyDto } from 'zjf-types'
import { useRequest } from '../../../composables/request'

const { $put } = useRequest()

export function requestVerification(options: ICreateVerificationBodyDto) {
  return $put('/verification', options)
}
