import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { IPointTransactionCreate } from './interfaces/IPointTransactionCreate';
import { POINT_TRANSACTION_STATUS_ENUM } from './entities/point-transaction-status.enum';
import { Member } from '../member/entities/member.entity';
import * as querystring from 'querystring';

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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // order 테이블에 거래기록 1줄 생성
      const pointTransaction = {
        impUid,
        orderAmount: amount,
        user: _user,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      };
      const createTransaction = this.orderRepository.create(pointTransaction);
      await queryRunner.manager.save(createTransaction);

      // throw new Error('예기치 못한 실패!!'); // rollback 되는지 테스트

      console.log('_user.id', _user.id);
      // user 의 돈 찾아오기
      const user = await queryRunner.manager.findOne(Member, {
        where: { id: _user.id },
      });

      // user의 돈 업데이트 -> save 쓰면 쿼리 2번 나가서 비효율적
      const updatedUser = await this.memberRepository.create({
        ...user,
        point: user.point + amount,
      });
      await queryRunner.manager.save(updatedUser);

      await queryRunner.commitTransaction();

      // 최종결과 브라우저에 돌려주기
      return pointTransaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
