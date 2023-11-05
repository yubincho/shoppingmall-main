import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chats } from './entities/chats.entity';
import { CreateChatDto } from './dto/create-chat.dto';

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
}
