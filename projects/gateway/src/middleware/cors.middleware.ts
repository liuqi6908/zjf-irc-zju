import type { NestMiddleware } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // 允许的源
    const allowedOrigins = ['https://m.qiyandata.com:6443']
    const requestOrigin = req.header('Origin')

    if (allowedOrigins.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin)
      res.setHeader('Access-Control-Allow-Methods', 'POST')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    }

    next()
  }
}
