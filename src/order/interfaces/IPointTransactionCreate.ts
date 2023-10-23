import { RequestWithUserInterface } from '../../auth/interfaces/requestWithUser.interface';
import { POINT_TRANSACTION_STATUS_ENUM } from '../entities/point-transaction-status.enum';

export interface IPointTransactionCreate {
  impUid: string;
  amount: number;
  user: RequestWithUserInterface['user'];
  status?: POINT_TRANSACTION_STATUS_ENUM;
}
