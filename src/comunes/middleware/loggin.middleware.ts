import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import logger from 'src/logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    const userAgent = req.get('user-agent') || '';
    const context = 'HTTP';

    // Ocultar datos sensibles
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '******';
    }

    logger.info(
      `Entrada: ${method} ${originalUrl} - Body: ${JSON.stringify(sanitizedBody)} - User-Agent: ${userAgent}`,
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
