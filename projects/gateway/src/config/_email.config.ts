import { registerAs } from '@nestjs/config'

export default registerAs('email', () => ({
  resendApiKey: process.env.EMAIL_RESEND_API_KEY,
}))
