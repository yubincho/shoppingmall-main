import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from '../common/const/path.const';
import { v4 as uuid } from 'uuid';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function (req, file, cb) {
          // 121121-123-1213123-1213.jpg
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService, ConfigService],
  exports: [CommonService],
})
export class CommonModule {}
