import { Injectable } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private nodeMailerTransport: Mail;

  constructor(private readonly configService: ConfigService) {
    this.nodeMailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  sendEmail(options: Mail.Options) {
    return this.nodeMailerTransport.sendMail(options);
  }
}
