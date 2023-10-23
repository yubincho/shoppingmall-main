import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../../member/member.service';
import { ProviderEnum } from '../../member/entities/provider.enum';

@Injectable()
export class KakaoAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID'),
      callbackURL: configService.get('KAKAO_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const { profile_image, nickname } = profile._json.properties;
    const { email } = profile._json.kakao_account;
    const { provider } = profile;
    console.log(profile);
    try {
      const member = await this.memberService.getUserByEmail(email);
      if (member.provider !== provider) {
        // 이미 provider 로 가입된 이메일 있음 경고 ( status.code = 409 )
        throw new HttpException(
          'You are already subscribe to ${user.provider}',
          HttpStatus.CONFLICT,
        );
      }
      done(null, member);
    } catch (err) {
      // DB 에 이메일이 없으면 회원가입 프로세스
      console.log(err.status);
      if (err.status === 404) {
        const newMember = await this.memberService.registerMember({
          name: nickname,
          email,
          provider: ProviderEnum.KAKAO,
          profileImg: profile_image,
        });
        done(null, newMember);
      }
    }
    // done(null, profile);
  }
}
