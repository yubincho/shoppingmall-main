import { Order } from '../entities/order.entity';

export interface IPointTransactionCheckHasCancelablePoint {
  pointTransactions: Order[];
}
