import { Module } from '@nestjs/common';
import { PortoneService } from './portone.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [PortoneService],
  exports: [PortoneService],
})
export class PortoneModule {}
