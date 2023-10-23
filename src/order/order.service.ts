import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { IPointTransactionCreate } from './interfaces/IPointTransactionCreate';
import { POINT_TRANSACTION_STATUS_ENUM } from './entities/point-transaction-status.enum';
import { Member } from '../member/entities/member.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private dataSource: DataSource,
  ) {}

  async create({ impUid, amount, user: _user }: IPointTransactionCreate) {
    // order 테이블에 거래기록 1줄 생성

    const pointTransaction = {
      impUid,
      orderAmount: amount,
      user: _user,
      status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    };
    const createTransaction = this.orderRepository.create(pointTransaction);
    await this.orderRepository.save(createTransaction);

    console.log('_user.id', _user.id);
    // user 의 돈 찾아오기
    const user = await this.memberRepository.findOne({
      where: { id: _user.id },
    });
    // user의 돈 업데이트 -> save 쓰면 쿼리 2번 나가서 비효율적
    await this.memberRepository.update(
      { id: _user.id },
      { point: user.point + amount },
    );
    // 최종결과 브라우저에 돌려주기
    return pointTransaction;
  }
}
