import { registerAs } from '@nestjs/config'

export default registerAs('zstack', () => {
  return {
    host: process.env.ZSTACK_HOST,
    user: process.env.ZSTACK_USER,
    password: process.env.ZSTACK_PSWD,
  }
})
