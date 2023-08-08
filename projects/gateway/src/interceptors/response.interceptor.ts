import type { Observable } from 'rxjs'
import { catchError, map } from 'rxjs'
import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common'
import {
  Injectable,
} from '@nestjs/common'
import { responseSuccess } from '../utils/response'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => {
        const req: FastifyRequest = context.switchToHttp().getRequest()
        if (req.url.match(/\/file\//) && req.method === 'GET')
          return data
        return responseSuccess(data)
      }),
      catchError(async (err) => {
        throw err
      }),
    )
  }
}
