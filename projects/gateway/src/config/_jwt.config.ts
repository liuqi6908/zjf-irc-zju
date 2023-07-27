import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    loginAuthSecret: process.env.JWT_LOGIN_AUTH_SECRET,
    loginAuthExpireInSeconds: parseInt(
      process.env.JWT_LOGIN_AUTH_EXPIRE_IN_SECONDS,
    ),
    // tmpOperationAuthSecret: process.env.JWT_TMP_OPERATION_AUTH_SECRET,
  };
});
