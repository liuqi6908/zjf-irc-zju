import { registerAs } from '@nestjs/config'

export interface LoginApp {
  host: string
  app_key: string
  app_secret: string
  public_key: string
  private_key: string
}

export default registerAs('login', () => {
  return {
    host: process.env.LOGIN_APP_HOST,
    app_key: process.env.LOGIN_APP_KEY,
    app_secret: process.env.LOGIN_APP_SECRET,
    public_key: process.env.LOGIN_PUBLIC_KEY,
    private_key: process.env.LOGIN_PRIVATE_KEY,
  } as LoginApp
})
