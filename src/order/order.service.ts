import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { IPointTransactionCreate } from './interfaces/IPointTransactionCreate';
import { POINT_TRANSACTION_STATUS_ENUM } from './entities/point-transaction-status.enum';
import { Member } from '../member/entities/member.entity';
import { PortoneService } from '../portone/portone.service';
import { IPointCheckTransactionFindByImpUid } from './interfaces/IPointCheckTransactionFindByImpUid';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    private readonly portoneService: PortoneService,
    private dataSource: DataSource,
  ) {}

  async findOneByImpUid({ impUid }: IPointCheckTransactionFindByImpUid) {
    return await this.orderRepository.findOne({ where: { impUid } });
  }

  async checkTransactionDuplication({
    impUid,
  }: IPointCheckTransactionFindByImpUid): Promise<void> {
    const result = await this.findOneByImpUid({ impUid });
    if (result) throw new ConflictException('이미 등록된 결제 아이디입니다.');
  }

  // 결제 생성, 결제하기
  async create({ impUid, amount, user: _user }: IPointTransactionCreate) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 결제완료 상태인지 검증하기
      await this.portoneService.checkPaid({ impUid, amount });
      // 이미 결제됐던 id인지 검증하기
      await this.checkTransactionDuplication({ impUid });
      // (위 검증 모두 마친 후 새로운 결제라면) order 테이블에 거래기록 1줄 생성
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
