import { registerAs } from '@nestjs/config'

export interface YunApp {
  host: string
  public_key: string
}

export default registerAs('yun', () => {
  return {
    host: process.env.YUN_APP_HOST,
    public_key: process.env.YUN_PUBLIC_KEY,
  } as YunApp
})
