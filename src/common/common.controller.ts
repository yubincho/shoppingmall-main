import {
  Body,
  Controller,
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
  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  postImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
    };
  }

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.commonService.uploadFileToS3('cats', file);
  }

  @Post('cats')
  getImageUrl(@Body('key') key: string) {
    return this.commonService.getAwsS3FileUrl(key);
  }
}
