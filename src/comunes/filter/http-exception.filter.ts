import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from 'src/logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : exception;

    const context = 'Exception';
    const requestId = uuidv4();
    const clientIp = request.ip;
    const userAgent = request.get('user-agent') || '';
    const stack = exception instanceof Error ? exception.stack : '';

    logger.error(
      `ID: ${requestId} - ${request.method} ${request.url} ${status} - ${JSON.stringify(message)} - IP: ${clientIp} - User-Agent: ${userAgent} - Stack: ${stack}`,
      { context },
    );

    response.status(status).json({
      requestId,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      clientIp,
      userAgent,
    });
  }
}
