import { IsNumber, IsString } from 'class-validator';

export class CreateMessagesDto {
  @IsString()
  messages: string;

  @IsNumber()
  chatId: number;

  @IsString()
  authorId: string;
}
