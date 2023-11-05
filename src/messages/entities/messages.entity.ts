import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { Chats } from '../../chats/entities/chats.entity';
import { Member } from '../../member/entities/member.entity';

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsString()
  message: string;

  @ManyToOne(() => Chats, (chat) => chat.messages)
  chat: Chats;

  @ManyToOne(() => Member, (user) => user.messages)
  author: Member;
}
