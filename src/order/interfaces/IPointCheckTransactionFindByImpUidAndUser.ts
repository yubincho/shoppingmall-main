import { RequestWithUserInterface } from '../../auth/interfaces/requestWithUser.interface';

export interface IPointCheckTransactionFindByImpUidAndUser {
  impUid: string;
  user: RequestWithUserInterface['user'];
}
