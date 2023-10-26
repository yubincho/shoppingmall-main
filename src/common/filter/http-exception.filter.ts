import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosHeaders } from 'axios';

@Catch() // HttpException 삭제. axios를 포함한 모든 에러 잡기.
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // @ts-ignore
    const status = exception.getStatus();
    // default 예외
    // const error = {
    //   status: HttpStatus.INTERNAL_SERVER_ERROR,
    //   message: '예외가 발생했어요.',
    // };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const err = exception.getResponse() as
      | string
      | { error: string; statusCode: 400; message: string[] };

    // Http 예외
    if (exception instanceof HttpException) {
      // success: false;
      // error.status = exception.getStatus();
      // error.message = exception.message;
      return response.status(status).json({
        success: false,
        code: exception.getStatus(),
        data: exception.message,
      });
    } else if (exception instanceof AxiosHeaders) {
      // Axios 예외
      // success: false;
      // error.status = exception.response.status;
      // error.message = exception.response.data.message;
      return response.status(status).json({
        success: false,
        code: exception.exception.response.status,
        data: exception.response.data.message,
      });
    }
  }
}
