import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { PaginatePostDto } from './dto/paginate-post.dto';
import { LogInterceptor } from '../common/interceptor/log.interceptor';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseInterceptors(LogInterceptor)
  @Get('all')
  async productGetAll(@Query() body: PaginatePostDto) {
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
  async productCreate(@Body() createProductDto: CreateProductDto) {
    // await this.productService.createProductImage(createProductDto);

    return await this.productService.createProduct(createProductDto);
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
