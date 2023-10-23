import { CommonEntity } from '../../product/entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Comment extends CommonEntity {
  @Column()
  public content: string;

  @ManyToOne(() => Member, (user: Member) => user.comments)
  public user: Member;

  @ManyToOne(() => Product, (product: Product) => product.comments)
  public product: Product;
}
