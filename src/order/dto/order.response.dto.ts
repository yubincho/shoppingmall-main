import { POINT_TRANSACTION_STATUS_ENUM } from '../entities/point-transaction-status.enum';
import { Member } from '../../member/entities/member.entity';
import { Product } from '../../product/entities/product.entity';

export class OrderResponseDto {
  orderAmount: number;
  impUid: string;
  user: Member;
  status: POINT_TRANSACTION_STATUS_ENUM;
}
