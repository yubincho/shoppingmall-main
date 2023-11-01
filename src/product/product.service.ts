import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { join, basename } from 'path';
import {
  PRODUCTS_IMAGE_PATH,
  TEMP_FOLDER_PATH,
} from '../common/const/path.const';
import { promises } from 'fs';

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
    // products.forEach((product) => {
    //   product.productImage = `/public/products/${product.productImage}`;
    // });

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

  /** 파일 생성
   * 1. 이미지 업로드 -> temp 폴더에 저장
   * 2. temp 폴더에 이미지 있는지 null 체크
   * 3. temp 폴더 이미지를 products 폴더로 옮기기
   * */
  // async createProductImage(dto: CreateProductDto) {
  //   // dto의 이미지 이름을 기반으로 파일의 경로를 생성한다.
  //   const tempFilePath = join(TEMP_FOLDER_PATH, dto.productImage);
  //
  //   try {
  //     // 파일이 있는지 확인
  //     // 파일이 없다면 에러를 던짐
  //     await promises.access(tempFilePath);
  //   } catch (e) {
  //     throw new HttpException(
  //       '존재하지 않는 파일입니다.',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //
  //   // 파일의 이름만 가져오기
  //   // Users/aaa/bbb/ccc/asdf.jpg => asdf.jpg
  //   const fileName = basename(tempFilePath);
  //
  //   // 새로 이동할 products 폴더의 경로 + 이미지 이름
  //   // {프로젝트 경로}/public/product/asdf.jpg
  //   const newPath = join(PRODUCTS_IMAGE_PATH, fileName);
  //
  //   // 파일 옮기기, tempFilePath-> newPath
  //   await promises.rename(tempFilePath, newPath);
  //
  //   return true;
  // }

  async createProduct(createProductDto: CreateProductDto) {
    // productImage가 배열로 들어오면 그대로 사용, 그렇지 않은 경우 콤마로 구분된 문자열을 배열로 변환
    // if (!Array.isArray(createProductDto.productImage)) {
    //   createProductDto.productImage = createProductDto.productImage.split(',');
    // }
    const newProduct = await this.productRepository.create({
      ...createProductDto,
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
    return null; // undefined  promise 사용해서 dto로 반환
  }

  async deleteByIdOfProduct(id: string) {
    const product = this.getByIdOfProduct(id);
    if (product) {
      await this.productRepository.delete(id);
    }
    return 'deleted';
  }
}
