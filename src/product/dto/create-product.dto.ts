import { IsString, IsOptional, IsArray } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import { Product } from '../entities/product.entity';

export class CreateProductDto {
  title: string;
  desc: string;
  price: number;
}
