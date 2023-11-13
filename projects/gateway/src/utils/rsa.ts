import { JSDOM } from 'jsdom'

const { window } = new JSDOM('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>')
let encrypt

/**
 * 生成密码本
 */
async function generateEncrypt() {
  globalThis.window = window
  const JSEncrypt = await import('jsencrypt/bin/jsencrypt.min.js')
  encrypt = new JSEncrypt()
  delete globalThis.window
}

/**
 * 生成签名
 * @param appKey
 * @param appSecret
 * @param publicKey
 * @returns
 */
export async function generateSign(appKey: string, appSecret: string, publicKey: string) {
  if (!encrypt)
    await generateEncrypt()

  const data = `app_key=${appKey}&app_secret=${appSecret}`
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(data)
}

/**
 * 使用 rse 解密
 * @param cipherText
 * @param privateKey
 * @returns
 */
export async function rsaDecrypt(cipherText: string, privateKey: string) {
  if (!encrypt)
    await generateEncrypt()

  encrypt.setPrivateKey(privateKey)

  return encrypt.decrypt(cipherText)
}
