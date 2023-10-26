import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';

@Catch() // HttpException 삭제. axios를 포함한 모든 에러 잡기.
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = '예외가 발생했어요.';

    // http 에러 잡기
    if (exception instanceof HttpException) {
      message = exception.message;
    } else if (exception instanceof AxiosError) {
      // Axios 에러 잡기
      const axiosError = exception as AxiosError;
      status = axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // message = axiosError.response?.data?.message || 'Axios 예외가 발생했어요.';
      message = axiosError.response.data?.message || 'Axios 예외가 발생했어요.';
    }

    response.status(status).json({
      success: false,
      code: status,
      message: message,
    });
  }
}
