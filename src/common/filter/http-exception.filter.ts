import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const err = exception.getResponse() as
      | string
      | { error: string; statusCode: 400; message: string[] };

    if (typeof err !== 'string' && err.error === 'Bad Request') {
      //class validator 가 발생시킨 에러
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    response.status(status).json({
      success: false,
      code: status,
      data: err,
    });
  }
}
