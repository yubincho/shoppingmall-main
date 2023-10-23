import { ProviderEnum } from '../entities/provider.enum';

export class CreateMemberDto {
  name: string;
  email: string;
  password?: string;
  provider?: ProviderEnum;
  profileImg?: string;
}
