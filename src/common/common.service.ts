import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class CommonService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // process.env.AWS_S3_ACCESS_KEY
      secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      region: this.configService.get('AWS_S3_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_S3_BUCKET_NAME'); // nest-s3
  }

  /**
   * 단일 파일 업로드
   * */
  async uploadFileToS3(
    folder: string, // S3 드라이브(파일이 저장될 곳)- 임의로 folder라고 정함
    file: Express.Multer.File,
  ): Promise<{
    key: string;
    s3Object: PromiseResult<AWS.S3.PutObjectOutput, AWS.AWSError>;
    contentType: string;
  }> {
    try {
      const key = `${folder}/${Date.now()}_${path.basename(
        file.originalname,
      )}`.replace(/ /g, '');

      const s3Object = await this.awsS3
        .putObject({
          Bucket: this.S3_BUCKET_NAME,
          Key: key,
          Body: file.buffer,
          ACL: 'public-read',
          ContentType: file.mimetype,
        })
        .promise();
      return { key, s3Object, contentType: file.mimetype };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }

  /**
   * 단일 파일 삭제
   * */
  async deleteS3Object(
    key: string,
    callback?: (err: AWS.AWSError, data: AWS.S3.DeleteObjectOutput) => void,
  ): Promise<{ success: true }> {
    try {
      await this.awsS3
        .deleteObject(
          {
            Bucket: this.S3_BUCKET_NAME,
            Key: key,
          },
          callback,
        )
        .promise();
      return { success: true };
    } catch (error) {
      throw new BadRequestException(`Failed to delete file : ${error}`);
    }
  }

  public getAwsS3FileUrl(objectKey: string) {
    const url = `https://${this.S3_BUCKET_NAME}.s3.amazonaws.com/${objectKey}`;

    console.log(url);
    return url;
  }

  /**
   * Multi 파일 업로드
   * */
  async uploadMultipleFilesToS3(
    folder: string,
    files: Express.Multer.File[],
  ): Promise<{
    uploads: {
      key: string;
      s3Object: AWS.S3.PutObjectOutput;
      contentType: string;
    }[];
  }> {
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const key = `${folder}/${Date.now()}_${path.basename(
            file.originalname,
          )}`.replace(/ /g, '');

          const s3Object = await this.awsS3
            .putObject({
              Bucket: this.S3_BUCKET_NAME,
              Key: key,
              Body: file.buffer,
              ACL: 'public-read',
              ContentType: file.mimetype,
            })
            .promise();

          return { key, s3Object, contentType: file.mimetype };
        }),
      );

      return { uploads };
    } catch (error) {
      throw new BadRequestException(`File upload failed : ${error}`);
    }
  }
}
