import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    return await this.brandService.createBrand(createBrandDto);
  }

  @Get('all')
  async getAllBrand() {
    return await this.brandService.getAllBrand();
  }

  @Get(':id')
  async getBrandById(@Param('id') id: string) {
    return await this.brandService.getByIdOfBrand(id);
  }
}
