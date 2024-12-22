import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ErrorPlantopia } from '../error-plantopia/error-plantopia';
import logger from 'src/logger';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let errorResponse: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse();
      message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message || 'Unknown error';
    } else if (exception instanceof ErrorPlantopia) {
      status = exception.statusCode;
      message = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Ha ocurrido un error interno';
    }

    logger.error(`Excepción capturada: ${message}`, {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      stack: exception instanceof Error ? exception.stack : null,
      requestBody: request.body,
      queryParams: request.query,
      headers: request.headers,
      error: exception instanceof Error ? exception.message : null,
      exception: exception, // Esto ayudará a ver más detalles del error
    });

    response.status(status).json({
      statusCode: status,
      message:
        process.env.NODE_ENV === 'production' &&
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'Ha ocurrido un error interno'
          : message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: exception instanceof Error ? exception.message : null,
      stack: exception instanceof Error ? exception.stack : null,
      details: exception instanceof HttpException ? errorResponse : null,
    });
  }
}
