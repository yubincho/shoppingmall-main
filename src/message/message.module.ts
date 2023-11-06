import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Messages } from '../message/entities/messages.entity';
import { ChatsService } from '../chats/chats.service';
import { Chats } from '../chats/entities/chats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Messages, Chats])],
  controllers: [MessageController],
  providers: [MessageService, ChatsService],
})
export class MessageModule {}
