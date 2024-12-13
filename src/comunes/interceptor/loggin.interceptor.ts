import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import logger from 'src/logger';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl } = request;
    const contextName = context.getClass().name;

    logger.info(
      `Flujo de implementación: ${method} ${originalUrl} - Contexto: ${contextName}`,
      { context: contextName },
    );

    return next.handle().pipe(
      tap((data) => {
        logger.info(
          `Salida: ${method} ${originalUrl} - Respuesta: ${JSON.stringify(data)}`,
          { context: contextName },
        );
      }),
    );
  }
}
