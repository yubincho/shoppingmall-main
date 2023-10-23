import { Member } from '../../member/entities/member.entity';
import { Product } from '../../product/entities/product.entity';

export class CreateCommentDto {
  content: string;
  user: Member;
  product: Product;
}
