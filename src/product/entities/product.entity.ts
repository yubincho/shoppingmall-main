import { CommonEntity } from '../../common/common-entities/common.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from '../../brand/entities/brand.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Order } from '../../order/entities/order.entity';
import { PRODUCT_PUBLIC_IMAGE_PATH } from '../../common/const/path.const';
import { join } from 'path';
import { Transform } from 'class-transformer';

@Entity()
export class Product extends CommonEntity {
  @Column()
  public title: string;

  @Column()
  public desc: string;

  @Column()
  public price: number;

  @Column({ nullable: true })
  @Transform(
    ({ value }) => value && `/${join(PRODUCT_PUBLIC_IMAGE_PATH, value)}`,
  )
  public productImage?: string;

  @ManyToOne(() => Brand, (brand: Brand) => brand.name, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn()
  public brand: Brand;

  @OneToMany(() => Comment, (comment: Comment) => comment.product)
  public comments: Comment[];

  @OneToMany(() => Order, (order: Order) => order.product)
  public orders: Order[];
}
