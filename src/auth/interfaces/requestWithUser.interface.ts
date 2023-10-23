import { Member } from '../../member/entities/member.entity';
import { Request } from 'express';

export interface RequestWithUserInterface extends Request {
  user: Member;
}
