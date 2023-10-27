import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getAllProducts() {
    const products = await this.productRepository.find({
      relations: ['brand'],
    });
    // 모든 제품의 이미지 URL에 '/public/products/' 경로 추가
    products.forEach((product) => {
      product.productImage = `/public/products/${product.productImage}`;
    });
    return products;
  }

  async getByIdOfProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
    if (!product) {
      throw new HttpException('No product', HttpStatus.NOT_FOUND);
    }
    console.log(product.brand);
    // return
    return product;
  }

  async createProduct(createProductDto: CreateProductDto, image?: string) {
    const newProduct = await this.productRepository.create({
      ...createProductDto,
      productImage: image,
    });
    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    const product = this.getByIdOfProduct(id);
    if (product) {
      return await this.productRepository.update(id, {
        ...updateProductDto,
      });
    }
    return undefined; // undefined
  }

  async deleteByIdOfProduct(id: string) {
    const product = this.getByIdOfProduct(id);
    if (product) {
      await this.productRepository.delete(id);
    }
    return 'deleted';
  }
}
