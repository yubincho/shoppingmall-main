import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../../member/member.service';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { provider, displayName, email, picture } = profile;
    // 1. 멤버가 있는지 확인해보기 . 없으면 예외처리로 진행
    // 2. 로그인 처리 , DB 에 저장
    try {
      const member = await this.memberService.getUserByEmail(email);
      console.log('[member]', member);
      if (member.provider !== provider) {
        // console.log('++++++++++++++');
        throw new HttpException(
          'You are already subscribe to ${user.provider}',
          HttpStatus.CONFLICT,
        );
      }
      done(null, member);
    } catch (err) {
      console.log(err.message);
      if (err.status === 404) {
        const newMember = await this.memberService.registerMember({
          name: displayName,
          email,
          provider,
          profileImg: picture,
        });
        done(null, newMember);
      }
    }
    // done(null, profile);
  }
}
