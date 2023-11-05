import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Messages } from './entities/messages.entity';
import { CreateMessagesDto } from './dto/create-messages.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Messages)
    private readonly messageRepository: Repository<Messages>,
  ) {}

  async createMessages(dto: CreateMessagesDto) {
    const message = await this.messageRepository.save({
      chat: { id: dto.chatId },
      author: { id: dto.authorId },
      messages: { messages: dto.messages },
    });

    return await this.messageRepository.findOne({
      where: { id: message.id },
    });
  }
}
