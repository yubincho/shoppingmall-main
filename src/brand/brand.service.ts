import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async createBrand(createBrandDto: CreateBrandDto) {
    const newBrand = await this.brandRepository.create(createBrandDto);
    await this.brandRepository.save(newBrand);
    return newBrand;
  }

  async getAllBrand() {
    const brands = await this.brandRepository.find({
      relations: ['products'],
    });
    return brands;
  }

  async getByIdOfBrand(id: string) {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    return brand;
  }

  async deleteBrand(id: string) {
    const brand = await this.getByIdOfBrand(id)
    if (!brand) {
      throw new HttpException('No brand', HttpStatus.NOT_FOUND)
    }

    await this.brandRepository.remove(brand)
    return ' Brand deleted.'
  }

}
