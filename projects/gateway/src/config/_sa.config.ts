import { registerAs } from '@nestjs/config'

export interface SysAdmin {
  account: string
  password: string
}

export default registerAs('sa', () => ({
  /* list: (process.env.SYS_ADMIN || '').replace(/\s+/g, '').split(',').map((item) => {
    const [account, password] = item.trim().split('@')
    return { account, password } as SysAdmin
  }), */
  list: [{
    account: process.env.SYS_ADMIN_ACCOUNT,
    password: process.env.SYS_ADMIN_PASSWORD,
  }] as SysAdmin[],
}))
