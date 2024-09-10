import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, ImATeapotException } from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class GlobalFilter<ImATeapotException> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('Filter Global Plantopia');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    
    response.status(status).json({
      /*queda mas mejor el  */
      statusCode: status,
      fecha: new Date().toISOString(),
      path: request.url,
      message: message,
        //mensajes: exception.getResponse()["message"],
      //error: "Error en la petición",
    });
    console.log('Filter Global PLANTOPIA Status:' + status);
    console.log('Filter Global PLANTOPIA Mensaje del PIPE:' + message);
  }

}
