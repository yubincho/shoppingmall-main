import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Order } from './entities/order.entity';
import { Member } from '../member/entities/member.entity';
import { PortoneService } from '../portone/portone.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Member])],
  controllers: [OrderController],
  providers: [OrderService, PortoneService, ConfigService],
  exports: [OrderService],
})
export class OrderModule {}
