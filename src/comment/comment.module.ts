import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { MemberModule } from '../member/member.module';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { Member } from '../member/entities/member.entity';
import { Product } from '../product/entities/product.entity';
import { MemberService } from '../member/member.service';
import { ProductService } from '../product/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Member, Product]),
    MemberModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, MemberService, ProductService],
  exports: [CommentService],
})
export class CommentModule {}
