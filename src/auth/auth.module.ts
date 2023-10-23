import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MemberModule } from '../member/member.module';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { EmailModule } from '../email/email.module';
import { KakaoAuthStrategy } from './strategies/kakao-auth.strategy';
import { NaverAuthStrategy } from './strategies/naver-auth.strategy';
import { GoogleAuthStrategy } from './strategies/google-auth.strategy';

@Module({
  imports: [
    MemberModule,
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalAuthStrategy,
    JwtAuthStrategy,
    KakaoAuthStrategy,
    NaverAuthStrategy,
    GoogleAuthStrategy,
  ],
})
export class AuthModule {}
