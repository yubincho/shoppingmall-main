import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chats } from './entities/chats.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from '../message/dto/create-message,dto';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chats)
    private readonly chatsRepository: Repository<Chats>,
  ) {}

  async createChat(dto: CreateChatDto) {
    // const chatUsers = dto.userIds.map((id) => ({ id }));
    // console.log('[chatUsers]', chatUsers);
    const chat = await this.chatsRepository.save({
      // [{id: 1}, {id: 2}, {id: 3}]
      users: dto.userIds.map((id) => ({ id })),
    });

    console.log('[dto.userIds]', dto.userIds);

    return await this.chatsRepository.findOne({
      where: { id: chat.id },
    });
  }

  async checkIfChatExists(chatId: number) {
    const exists = await this.chatsRepository.exist({
      where: { id: chatId },
    });
    return exists;
  }

  async findByIdOfChats(id: number) {
    const chat = await this.chatsRepository.findOne({
      where: { id },
    }); // 예시: 채팅 정보를 가져오는 메서드
    if (!chat) {
      throw new WsException(`채팅방 아이디를 찾을 수 없습니다. Chat ID: ${id}`);
    }

    return chat;
  }
}
