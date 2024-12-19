import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LogRespuestasInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    return next.handle().pipe(
      tap({
        next: (data) => {
          const statusCode = response.statusCode;
          if (statusCode >= 200 && statusCode < 300) {
            const logger = new Logger(LogRespuestasInterceptor.name);
            logger.log(
              `✅ Respuesta exitosa [${statusCode}] Interceptor ➡️ 🚀 :`,
              {
                requestUrl: request.url,
                requestMethod: method,
                responseData: data,
              },
            );
          }
        },
      }),
      catchError((err) => {
        const statusCode = err.status || err.statusCode || 500;
        const errorResponse = {
          statusCode,
          message: err.message || 'Internal Server Error',
          error: err.response || 'Unknown Error',
        };
        const logger = new Logger(LogRespuestasInterceptor.name);
        logger.error(
          `❌ Error en la respuesta [${statusCode}] Interceptor ➡️ 🚨 :`,
          {
            requestUrl: request.url,
            requestMethod: method,
            errorResponse,
          },
        );
        return throwError(() => err);
      }),
    );
  }
}
