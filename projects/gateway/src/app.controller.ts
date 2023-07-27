import { Controller, Get } from '@nestjs/common'

import { ErrorCode } from 'zjf-types'
import { AppService } from './app.service'
import { ApiErrorResponse, ApiSuccessResponse } from './utils/response'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiErrorResponse(ErrorCode.AUTH_LOGIN_EXPIRED, ErrorCode.AUTH_LOGIN_REQUIRED)
  @ApiSuccessResponse(String)
  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
