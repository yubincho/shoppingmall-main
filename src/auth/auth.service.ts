import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { CreateMemberDto } from '../member/dto/create-member.dto';
import { LoginMemberDto } from '../member/dto/login-member.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadInterface } from './interfaces/tokenPayload.interface';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberService: MemberService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerUser(createMemberDto: CreateMemberDto) {
    const newUser = await this.memberService.registerMember(createMemberDto);
    // newUser.password = undefined;
    return newUser;
  }

  async loggedInUser(loginMemberDto: LoginMemberDto) {
    const user = await this.memberService.getUserByEmail(loginMemberDto.email);
    // if (user.password !== loginMemberDto.password) {
    //   throw new HttpException('Password do not match', HttpStatus.CONFLICT);
    // }
    const isMatchedPassword = await user.checkPassword(loginMemberDto.password);

    if (!isMatchedPassword) {
      console.error('Password do not match');
      throw new HttpException('Password do not match', HttpStatus.CONFLICT);
    }

    return user;
  }

  async generateAccessToken(userId: string) {
    const payload: TokenPayloadInterface = { userId };
    const token = await this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}h`,
    });
    return token;
  }

  async sendEmail(email: string) {
    const generateNumber = this.generateOTP();
    await this.cacheManager.set(email, generateNumber);
    await this.emailService.sendEmail({
      to: email,
      subject: '[유빈의집] 인증코드 안내',
      text: `confirm number is ${generateNumber}`,
    });

    return 'success';
  }

  async confirmEmailVerification(email: string, code: string) {
    const emailCodeByRedis = await this.cacheManager.get(email);
    if (emailCodeByRedis !== code) {
      throw new BadRequestException('Wrong code provided');
    }
    await this.cacheManager.del(email);
    return true;
  }

  async welcomeEmail(email: string) {
    await this.emailService.sendEmail({
      to: email,
      subject: 'welcome to Yubins house',
      text: '환영합니다.',
    });
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
