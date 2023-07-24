import { map, Observable, catchError } from 'rxjs';
import { responseSuccess } from '../utils/response';

import {
  Injectable,
  CallHandler,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      map((data) => responseSuccess(data)),
      catchError(async (err) => {
        throw err;
      }),
    );
  }
}
