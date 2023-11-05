import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { ChatsGateway } from './chats.gateway';
import { Chats } from './entities/chats.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagesService } from '../messages/messages.service';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chats]), MessagesModule],
  controllers: [ChatsController],
  providers: [ChatsGateway, ChatsService, MessagesService],
  exports: [ChatsService],
})
export class ChatsModule {}
