/* eslint-disable @typescript-eslint/no-explicit-any */
import { md5 } from "./md5"

export function sortObj(obj: any): any{
  if (Object.prototype.toString.call(obj) === '[object Array]')
    return (obj as Array<any>).sort().map((el) => sortObj(el));
  else if (Object.prototype.toString.call(obj) === '[object Object]') {
    const keys = Object.keys(obj).sort();
    return keys.reduce((prev, curr) => {
      prev[curr] = sortObj(obj[curr]);
      return prev;
    }, {} as any);
  } else return obj;
}

export const hashObject = (obj: unknown) => md5(JSON.stringify(sortObj(obj)));
