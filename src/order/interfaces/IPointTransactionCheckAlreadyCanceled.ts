import { Order } from '../entities/order.entity';

export interface IPointTransactionCheckAlreadyCanceled {
  pointTransactions: Order[];
}
