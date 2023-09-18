
/**
 * 下载csv
 * @param csvRaw
 * @param name
 */
export function downloadCsv(csvRaw: string, name?: string) {
  const url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(csvRaw);
  download(url, name);
}

/**
 * 下载指定的链接
 * @param url
 * @param name
 */
export function download(url: string, name?: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name || '';
  a.target = '_blank';
  a.click();
}
