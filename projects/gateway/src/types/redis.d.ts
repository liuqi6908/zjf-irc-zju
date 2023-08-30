const enum RedisType {
  /** 登录 token 缓存 */
  AUTH_JWT = 'auth_jwt',
  /** 验证码 */
  CODE = 'code',
  /** 数据目录缓存 */
  DATA_DIR_CACHE = 'data_dir_cache',
  /** 云桌面过期的通知缓存 */
  DESKTOP_EXPIRE_NOTIFY_CACHE = 'desktop_expire_notify_cache',
}
