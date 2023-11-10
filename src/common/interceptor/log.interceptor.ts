import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, observable, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 요청들어올때 [REQ] {요청 path} {요청 시간}
    // 요청 끝날때 [RES] {요청 path} {응답 시간} {걸린시간 ms}

    const now = new Date();
    const req = context.switchToHttp().getRequest();

    const path = req.originalUrl;
    // const now = new Date();

    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    return next.handle().pipe(
      // tap((observable) => console.log(observable)),
      tap((observable) =>
        console.log(
          `[RES] ${path} ${now.toLocaleString('kr')} ${
            new Date().getMilliseconds() - now.getMilliseconds()
          }ms`,
        ),
      ),
      // map((observable) => {
      //   return {
      //     message: '응답이 변경됐습니다',
      //     response: observable,
      //   };
      // }),
      // tap((observable) => console.log(observable)),
    );
  }
}
