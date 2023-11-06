import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message,dto';
import { Messages } from './entities/messages.entity';
import { ChatsService } from '../chats/chats.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
    private dataSource: DataSource,
    private readonly chatsService: ChatsService,
  ) {}

  async createMessages(dto: CreateMessageDto, authorId: string) {
    const chat = await this.chatsService.findByIdOfChats(dto.chatId);
    const message = await this.messageRepository.save({
      chat,
      author: { id: authorId },
      message: dto.message,
    });

    // return await this.messageRepository.findOne({
    //   where: { id: message.id },
    // });
    return message;
  }

  // async getAll() {
  //   return this.messageRepository.createQueryBuilder('');
  // }
}
