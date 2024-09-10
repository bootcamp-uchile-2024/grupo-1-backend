import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LogRespuestasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap({
        next: (data) => {
          const statusCode = response.statusCode;
          if (statusCode >= 200 && statusCode < 300) {
            console.log(
              `✅ Respuesta exitosa [${statusCode}] Interceptor ➡️ 🚀 :`,
              {
                requestUrl: request.url,
                responseData: data,
              },
            );
          }
        },
        error: (err) => {
          console.log('Error en la respuesta Interceptor 🚨 :', err);
        },
      }),
    );
  }
}
