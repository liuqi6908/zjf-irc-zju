import type { User } from 'src/entities/user'

export function getUserName(user?: User) {
  return user?.verification?.name || user?.nickname || user?.account || user?.id || '未知用户'
}
