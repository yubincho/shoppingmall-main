import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { Chats } from './entities/chats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from '../message/message.service';
import { Messages } from '../message/entities/messages.entity';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { MemberService } from '../member/member.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module';
import { Member } from '../member/entities/member.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chats, Messages, Member]),
    EmailModule,
    MemberModule,
    JwtModule.register({}),
  ],
  controllers: [ChatsController],
  providers: [
    ChatsGateway,
    ChatsService,
    MessageService,
    AuthService,
    MemberService,
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
