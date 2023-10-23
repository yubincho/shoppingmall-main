import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../../member/entities/provider.enum';

@Injectable()
export class NaverAuthGuard extends AuthGuard(ProviderEnum.NAVER) {}
