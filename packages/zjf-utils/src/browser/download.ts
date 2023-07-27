/**
 * 下载指定 `url` 的文件
 * @param url
 */
export function download(
  /** 要下载的资源地址 */
  url: string,
  /** 下载文件名 */
  filename?: string
) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename || "未命名文件";
  a.click();
}
