import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    // super.catch(exception, host);

    const socket = host.switchToWs().getClient();

    socket.emit('exception', {
      // exception으로 받은 내용을 data에 저장한다
      data: exception.getResponse(),
    });
  }
}
