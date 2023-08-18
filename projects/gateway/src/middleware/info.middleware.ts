import type { NestMiddleware } from '@nestjs/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class InfoMiddleware implements NestMiddleware {
  constructor() { }
  use(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    req.ip = ip
    next()
  }
}
