import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../../member/entities/provider.enum';

@Injectable()
export class KakaoAuthGuard extends AuthGuard(ProviderEnum.KAKAO) {}
