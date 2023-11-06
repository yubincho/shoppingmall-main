import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommonService } from './common.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('common')
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  // @UseGuards(JwtAuthGuard)
  // 임시로 temp 폴더에 저장
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  postImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
    };
  }

  // 임시로 temp 폴더에 저장
  @Post('images')
  @UseInterceptors(FilesInterceptor('image'))
  postFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedFiles = [];
    if (Array.isArray(files)) {
      files.forEach((file) => {
        uploadedFiles.push({ filename: file.filename });
      });
    }
    return uploadedFiles;
  }
  /**
   * S3 Single 파일 업로드
   * */
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.commonService.uploadFileToS3('mall', file);
  }

  /**
   * S3 Single 파일 url 반환
   * req: http://localhost:3000/api/common/mall
   * */
  @Get('mall')
  async getImageUrl(@Body('key') key: string) {
    // @param은 불러오지 못함
    return this.commonService.getAwsS3FileUrl(key);
  }

  /**
   * S3 Multi 파일 업로드
   * */
  @Post('uploads')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadMediaFiles(@UploadedFiles() files: Express.Multer.File[]) {
    console.log(files);
    return await this.commonService.uploadMultipleFilesToS3('mall', files);
  }
}
