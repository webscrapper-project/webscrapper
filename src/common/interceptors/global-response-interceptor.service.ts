import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponse } from '../types/http.response';
import { RawResponse } from '../types/raw.response';

function handleResponse(data: unknown, response: Response) {
  if (data instanceof HttpResponse || data instanceof RawResponse) {
    if (data.getStatus()) {
      response.status(data.getStatus());
    }

    return data.getResponse();
  }

  return new HttpResponse({ data, success: true }).getResponse();
}

@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(map((data) => handleResponse(data, response)));
  }
}
