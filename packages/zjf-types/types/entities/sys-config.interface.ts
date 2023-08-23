export interface ISysConfig {
  /** 外发配置 */
  export: {
    /** 小文件尺寸限制，单位为 字节 */
    sizeLimit: number;
    /** 小文件每日外发限制 */
    dailyLimit: number;
  }
}

