import { BadRequestException, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import {
  PRODUCTS_IMAGE_PATH,
  PUBLIC_FOLDER_PATH,
} from '../common/const/path.const';
import { v4 as uuid } from 'uuid';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    ServeStaticModule.forRoot({
      // http://localhost:3000/public/products/42c60eea-3c75-4043-84f7-79373384c0fe.png
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    MulterModule.register({
      limits: {
        fileSize: 10000000, // 10M까지
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(에러, boolean)
         *
         * 첫번째 파라미터는 에러가 있으면 에러 정보를 넣어준다
         * 두번째 파라미터는 파일을 받을지 말지 boolean을 넣어준다
         * */
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false,
          );
        }
        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, PRODUCTS_IMAGE_PATH);
        },
        filename: function (req, file, cb) {
          // 121121-123-1213123-1213.jpg
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
