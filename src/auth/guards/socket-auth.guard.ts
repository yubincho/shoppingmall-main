import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { MemberService } from '../../member/member.service';
import { TokenPayloadInterface } from '../interfaces/tokenPayload.interface';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const socket = context.switchToWs().getClient();
    const headers = socket.handshake.headers;

    console.log(headers);
    const rawToken = headers['authorization'];
    console.log(rawToken);
    if (!rawToken) {
      throw new WsException('토큰이 없습니다.');
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      console.log('[token]', token);
      const payload = await this.authService.verifyToken(token);
      console.log('[payload]', payload);
      console.log('[payload.userId]', payload.userId);
      const user = await this.memberService.getUserById(payload.userId);

      socket.user = user;
      socket.token = token;
      return true;
    } catch (e) {
      throw new WsException('토큰이 유효하지 않습니다.');
    }
  }
}
