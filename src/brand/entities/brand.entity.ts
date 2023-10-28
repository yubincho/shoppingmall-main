import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '../../common/common-entities/common.entity';
import { Product } from '../../product/entities/product.entity';

@Entity()
export class Brand extends CommonEntity {
  @Column()
  public name: string;

  @Column()
  public desc: string;

  @Column()
  public brandImg: string;

  @Column({ default: false }) // 기본적으로 false로 설정하여 활성 상태로 초기화
  public isDeleted: boolean;

  @OneToMany(() => Product, (product: Product) => product.brand)
  public products: Product[];
}
