import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    const defaultMessage = `${request.method} request successful`;

    return next.handle().pipe(
      map(data => {
        // Si es una respuesta paginada
        if (data && data.items && typeof data.total === 'number') {
          const page = parseInt(request.query.page) || 1;
          const limit = parseInt(request.query.limit) || 10;
          
          return {
            message: data.message || defaultMessage,
            data: data.items,
            pagination: {
              page,
              limit,
              total: data.total,
              totalPages: Math.ceil(data.total / limit)
            }
          };
        }

        // Si es una respuesta simple
        return {
          message: data?.message || defaultMessage,
          data: data?.data || data
        };
      }),
    );
  }
}
