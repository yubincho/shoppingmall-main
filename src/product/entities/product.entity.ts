import { CommonEntity } from './common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Comment } from '../../comment/entities/comment.entity';
import {Order} from "../../order/entities/order.entity";

@Entity()
export class Product extends CommonEntity {
  @Column()
  public title: string;

  @Column()
  public desc: string;

  @Column()
  public price: number;

  @Column({ nullable: true })
  public productImage?: string;

  @ManyToOne(() => Brand, (brand: Brand) => brand.name, { onDelete: 'NO ACTION' })
  @JoinColumn()
  public brand: Brand;

  @OneToMany(() => Comment, (comment: Comment) => comment.product)

  public comments: Comment[];

  @OneToMany(() => Order, (order: Order) => order.product)
  public orders: Order[]
}
