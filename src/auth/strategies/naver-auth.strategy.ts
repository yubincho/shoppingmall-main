import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-naver';
import { ConfigService } from '@nestjs/config';
import { MemberService } from '../../member/member.service';
import { ProviderEnum } from '../../member/entities/provider.enum';

@Injectable()
export class NaverAuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly memberService: MemberService,
  ) {
    super({
      clientID: configService.get('NAVER_CLIENT_ID'),
      clientSecret: configService.get('NAVER_CLIENT_SECRET'),
      callbackURL: configService.get('NAVER_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: any,
  ): Promise<any> {
    const { id } = profile;
    const { email, profile_image } = profile._json;
    const { provider } = profile;
    console.log(id, email, profile_image, provider);
    try {
      const member = await this.memberService.getUserByEmail(email);
      if (member.provider !== provider) {
        throw new HttpException(
          'You are already subscribe to ${user.provider}',
          HttpStatus.CONFLICT,
        );
      }
      done(null, member);
    } catch (err) {
      console.log(err.status);
      const newMember = await this.memberService.registerMember({
        name: id,
        email,
        provider: ProviderEnum.NAVER,
        profileImg: profile_image,
      });
      done(null, newMember);
    }
    // done(null, profile);
  }
}
