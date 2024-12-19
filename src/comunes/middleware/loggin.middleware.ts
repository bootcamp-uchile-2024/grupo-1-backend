import { Injectable, NestMiddleware, Param } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from 'src/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = req;
    const userAgent = req.get('user-agent') || '';
    const context = 'HTTP';

    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '******';
    }

    logger.info(
      `Datos de Entrada: ${method} ${originalUrl} - Body: ${JSON.stringify(sanitizedBody)} - Query: ${JSON.stringify(query)} - User-Agent: ${userAgent}`,
      { context },
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      logger.info(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent}`,
        { context },
      );
    });

    next();
  }
}
