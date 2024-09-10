import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogRespuestasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: (response) => {
          if (
            response &&
            response.statusCode >= 200 &&
            response.statusCode < 300
          ) {
            console.log('✅ Respuesta exitosa Interceptor ➡️ 🚀 :', response);
          }
        },
        error: (err) => {
          console.error('Error en la respuesta Interceptor 🚨 :', err);
        },
      }),
    );
  }
}
