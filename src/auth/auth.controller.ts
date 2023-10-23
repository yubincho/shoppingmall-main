import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMemberDto } from '../member/dto/create-member.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUserInterface } from './interfaces/requestWithUser.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { EmailVerificationDto } from '../member/dto/email-verification.dto';
import { KakaoAuthGuard } from './guards/kakao-auth.guard';
import { NaverAuthGuard } from './guards/naver-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  // async createUser(@Body() createMemberDto: CreateMemberDto) {
  async createUser(@Body() createMemberDto: CreateMemberDto) {
    const newUser = await this.authService.registerUser(createMemberDto); // dto 형태가 아닌 인자로 받을때
    // await this.authService.welcomeEmail(createMemberDto.email);
    return newUser;
  }

  @Post('send/email')
  async sendEmail(@Body('email') email: string) {
    return await this.authService.sendEmail(email);
  }

  @Post('verify/email')
  async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    const { email, code } = emailVerificationDto;
    return await this.authService.confirmEmailVerification(email, code);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async loginUser(@Req() req: RequestWithUserInterface) {
    const user = req.user;
    const token = await this.authService.generateAccessToken(user.id);
    user.password = undefined;
    return { user, token };
  }
  // async loginUser(@Body() loginMemberDto: LoginMemberDto) {
  //   // return await this.authService.loggedInUser(loginMemberDto);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req: RequestWithUserInterface) {
    return req.user;
  }

  @HttpCode(200)
  @Get('kakao')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin() {
    return HttpStatus.OK;
  }

  @Get('kakao/callback')
  @UseGuards(KakaoAuthGuard)
  async kakaoLoginCallback(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  @HttpCode(200)
  @Get('naver')
  @UseGuards(NaverAuthGuard)
  async naverLogin() {
    return HttpStatus.OK;
  }

  @Get('naver/callback')
  @UseGuards(NaverAuthGuard)
  async naverLoginCallback(@Req() req: RequestWithUserInterface) {
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }

  // 구글 : passport-google-oauth2 로 설치
  @HttpCode(200)
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {
    return HttpStatus.OK;
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req: RequestWithUserInterface) {
    // return req.user;
    const { user } = req;
    const token = await this.authService.generateAccessToken(user.id);
    return { user, token };
  }
}
