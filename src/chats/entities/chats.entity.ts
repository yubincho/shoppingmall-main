import {
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { Messages } from '../../message/entities/messages.entity';

/** 채팅 방 */
@Entity()
export class Chats {
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  @ManyToMany(() => Member, (user) => user.chats)
  users: Member[];

  @OneToMany(() => Messages, (message) => message.chat)
  messages: Messages;
}
