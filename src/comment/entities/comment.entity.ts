import { CommonEntity } from '../../common/common-entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { Product } from '../../product/entities/product.entity';
import { IsNumber, IsString } from 'class-validator';

@Entity()
export class Comment extends CommonEntity {
  @Column()
  @IsString()
  public content: string;

  @Column({ default: 0 })
  @IsNumber()
  public likeCount?: number;

  @ManyToOne(() => Member, (user: Member) => user.comments)
  public user: Member;

  @ManyToOne(() => Product, (product: Product) => product.comments)
  public product: Product;
}
