import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsService } from './chats.service';
import { EnterChatDto } from './dto/enter-chat.dto';

import { MessageService } from '../message/message.service';
import { CreateMessageDto } from '../message/dto/create-message,dto';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SocketCatchHttpExceptionFilter } from '../common/filter/socket-catch-http.exception-filter';
import { Member } from '../member/entities/member.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SocketAuthGuard } from '../auth/guards/socket-auth.guard';
import { AuthService } from '../auth/auth.service';
import { MemberService } from '../member/member.service';

export class Message {
  message: string;
  chatId: number;
}

@WebSocketGateway({
  // ws://localhost:3000/chats
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket & { user: Member }, ...args: any[]) {
    console.log(`on connect called : ${socket.id}`);

    const headers = socket.handshake.headers;

    console.log(headers);
    const rawToken = headers['authorization'];
    console.log(rawToken);
    if (!rawToken) {
      // throw new WsException('토큰이 없습니다.');
      socket.disconnect();
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = await this.authService.verifyToken(token);
      const user = await this.memberService.getUserById(payload.userId);

      socket.user = user;
      return true;
    } catch (e) {
      // throw new WsException('토큰이 유효하지 않습니다.');
      socket.disconnect();
    }
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('create_chat')
  async createChat(
    @MessageBody() data: CreateChatDto,
    @ConnectedSocket() socket: Socket & { user: Member },
  ) {
    const chat = await this.chatsService.createChat(data);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('enter_chat')
  async enterChat(
    // 방의 chat ID들을 리스트로 받는다
    @MessageBody() data: EnterChatDto,
    @ConnectedSocket() socket: Socket & { user: Member },
  ) {
    // for (const chatId of data) {
    //   // socket.join()
    //   socket.join(chatId.toString());
    // }

    for (const chatId of data.chatIds) {
      const exists = await this.chatsService.checkIfChatExists(chatId);

      if (!exists) {
        throw new WsException({
          code: 404,
          message: `존재하지 않는 chat 입니다. chatId: ${chatId}`,
        });
      }
    }

    socket.join(data.chatIds.map((x) => x.toString()));
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('send_messages')
  async sendMessages(
    @MessageBody() message: string,
    @ConnectedSocket() socket: Socket & { user: Member },
  ) {
    this.server.emit('receive_message', 'hello from server');
  }

  // socket.on('send_mesage', (message) => { console.log(message) }
  @UseFilters(SocketCatchHttpExceptionFilter)
  @SubscribeMessage('send_message') // send_message: 이벤트 이름
  async sendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() socket: Socket & { user: Member },
  ) {
    // console.log(dto);
    const chatExists = await this.chatsService.checkIfChatExists(dto.chatId);
    if (!chatExists) {
      throw new WsException(
        `존재하지 않는 채팅방입니다. Chat ID : ${dto.chatId}`,
      );
    }
    const message = await this.messageService.createMessages(
      dto,
      socket.user.id,
    );
    console.log('[message]', message);
    console.log('[message.chat.id]', message.chat.id);
    socket
      .to(message.chat.id.toString())
      .emit('receive_message', message.message);
    // socket.emit('receive_message', message.message);
    // this.server
    //   .in(message.chat.id.toString())
    //   .emit('receive_message', message.message);
    // this.server.in(dto.chatId.toString()).emit('receive_message', dto);
    // socket
    //   .to(message.chatId.toString())
    //   .emit('recieve_message', message.message);
    // this.server
    //   .in(message.chatId.toString())
    //   .emit('recieve_message', 'hello from server');
  }
}
