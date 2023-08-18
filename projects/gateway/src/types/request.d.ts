interface ExtendRequest extends Request {
  /** 当前登录的用户信息 */
  user?: import('../entities/user.ts').User
  /** 当前用户的凭证 */
  token?: string;
  /** 标记 accessToken 是否已过期 */
  accessTokenExpired?: boolean;

  /** 身份认证申请是否存在的守卫中已校验的信息 */
  verificationExistsGuardVerification?:  import('../entities/verification.ts').Verification

  /** 当前用户的数据下载角色信息，请确保调用了守卫，没有登录会获取游客角色 */
  dataRole?: "*" | import('../entities/data-role.ts').DataRole

  /** 中间件捕获的 IP 地址 */
  ip: string
}

declare interface FastifyRequest extends ExtendRequest {
  raw: ExtendRequest
}