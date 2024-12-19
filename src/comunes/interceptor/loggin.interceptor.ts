import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import logger from 'src/logger';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const { method, originalUrl, body, params, query } = request;
    const contextName = context.getClass().name;
    const now = Date.now();

    logger.info(
      `🚀🚀 => Flujo de implementación: 🚩 ${method} ${originalUrl} - Contexto: ${contextName}`,
      { context: contextName },
    );

    logger.verbose(
      `📖 Datos de entrada: ${method} ${originalUrl} - Body: ${JSON.stringify(body)} - Params: ${JSON.stringify(params)} - Query: ${JSON.stringify(query)}`,
      { context: contextName },
    );

    return next.handle().pipe(
      tap((data) => {
        const responseTime = Date.now() - now;
        logger.info(
          `Salida: ${method} ${originalUrl} - Respuesta: ${JSON.stringify(data)} - Tiempo de respuesta: ${responseTime}ms`,
          { context: contextName },
        );
      }),
      catchError((error) => {
        const responseTime = Date.now() - now;
        logger.error(
          `❌ Error en la respuesta: ${method} ${originalUrl} - Error: ${error.message} - Tiempo de respuesta: ${responseTime}ms`,
          { context: contextName, stack: error.stack },
        );
        throw error;
      }),
    );
  }
}
