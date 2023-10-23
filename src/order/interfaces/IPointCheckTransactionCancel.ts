import { RequestWithUserInterface } from '../../auth/interfaces/requestWithUser.interface';

export interface IPointCheckTransactionCancel {
  impUid: string;
  user: RequestWithUserInterface['user'];
}
