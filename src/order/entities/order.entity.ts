import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/entities/member.entity';
import { Product } from '../../product/entities/product.entity';
import { RoleEnum } from '../../member/entities/role.enum';
import { POINT_TRANSACTION_STATUS_ENUM } from './point-transaction-status.enum';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public orderId: number;

  @Column()
  impUid: string;

  @Column({ nullable: true })
  public quantity: number;

  @Column()
  public orderAmount: number;

  @Column({
    type: 'enum',
    enum: POINT_TRANSACTION_STATUS_ENUM,
  })
  public status: POINT_TRANSACTION_STATUS_ENUM;

  @CreateDateColumn()
  public orderDate: Date;

  @ManyToOne(() => Member, (user: Member) => user.orders)
  @JoinColumn({ name: 'member_id' })
  user: Member;

  @ManyToOne(() => Product, (product: Product) => product.orders, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
