import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { RoleEnum } from '../member/entities/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('all')
  async productGetAll() {
    const products = await this.productService.getAllProducts();
    return { count: products.length, products };
    // return products
  }

  @Get(':id')
  async productGeyById(@Param('id') id: string) {
    return await this.productService.getByIdOfProduct(id);
  }

  @Post('create')
  // @UseGuards(RoleGuard(RoleEnum.ADMIN))
  @UseInterceptors(FileInterceptor('productImage'))
  async productCreate(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // if (file) {
    //   createProductDto.productImage = file.filename; // 업로드된 파일의 파일명을 productImage로 설정합니다.
    // }
    const newProduct = await this.productService.createProduct(
      createProductDto,
      file?.filename,
    );
    return newProduct;
  }

  @Put(':id')
  @UseGuards(RoleGuard(RoleEnum.ADMIN))
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(RoleEnum.ADMIN))
  async deleteProduct(@Param() id: string) {
    return await this.productService.deleteByIdOfProduct(id);
  }
}
