import { IsString, IsOptional } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class CreateProductDto extends PickType(Product, [
  'title',
  'desc',
  'price',
]) {
  @IsString()
  @IsOptional()
  productImage?: string;
}
