import { IUser } from "./user.interface"
import { ICreatedAt, IUpdatedAt } from "./_timestamp.interface"


/**
 * 云桌面
 */
export interface IDesktop extends ICreatedAt, IUpdatedAt {
  /** 云桌面 ID， 需要管理员手动填写虚拟机的 id */
  id: string

  /** 内网地址 */
  internalIp: string

  /** 访问地址 */
  accessUrl: string

  /** 账号 */
  account: string

  /** 密码 */
  password: string

  /** 到期时间 */
  expiredAt: Date

  /** 云桌面当前绑定的用户 */
  user?: IUser

  /** 云桌面当前绑定的用户 ID */
  userId?: IUser['id']

  /** 上一个使用该云桌面的用户 */
  lastUser?: IUser

  /** 上一个使用该云桌面的用户 ID */
  lastUserId?: IUser['id']

  /** 是否已停用 */
  disabled?: boolean
}