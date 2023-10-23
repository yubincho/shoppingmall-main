import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProviderEnum } from '../../member/entities/provider.enum';

@Injectable()
export class GoogleAuthGuard extends AuthGuard(ProviderEnum.GOOGLE) {}
