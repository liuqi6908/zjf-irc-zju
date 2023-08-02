interface ExtendRequest extends Request {
  /** 当前登录的用户信息 */
  user?: import('../entities/user.ts').User
  /** 当前用户的凭证 */
  token?: string;
  /** 标记 accessToken 是否已过期 */
  accessTokenExpired?: boolean;
}

declare interface FastifyRequest extends ExtendRequest {
  raw: ExtendRequest
}