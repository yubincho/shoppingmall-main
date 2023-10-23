import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { IPointTransactionCreate } from './interfaces/IPointTransactionCreate';
import { POINT_TRANSACTION_STATUS_ENUM } from './entities/point-transaction-status.enum';
import { Member } from '../member/entities/member.entity';
import { PortoneService } from '../portone/portone.service';
import { IPointCheckTransactionFindByImpUid } from './interfaces/IPointCheckTransactionFindByImpUid';
import { IPointCheckTransactionFindByImpUidAndUser } from './interfaces/IPointCheckTransactionFindByImpUidAndUser';
import { IPointCheckTransactionCancel } from './interfaces/IPointCheckTransactionCancel';
import { IPointTransactionCheckAlreadyCanceled } from './interfaces/IPointTransactionCheckAlreadyCanceled';
import { IPointTransactionCheckHasCancelablePoint } from './interfaces/IPointTransactionCheckHasCancelablePoint';

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

  /** impUid로 결제내역 찾기 */
  async findOneByImpUid({ impUid }: IPointCheckTransactionFindByImpUid) {
    return await this.orderRepository.findOne({ where: { impUid } });
  }

  /** 중복된 결제인지 확인 */
  async checkTransactionDuplication({
    impUid,
  }: IPointCheckTransactionFindByImpUid): Promise<void> {
    const result = await this.findOneByImpUid({ impUid });
    if (result) throw new ConflictException('이미 등록된 결제 아이디입니다.');
  }

  /** 결제 생성, 결제하기 */
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

  /** 결제내역 조회  */
  async findByImpUidAndUser({
    impUid,
    user,
  }: IPointCheckTransactionFindByImpUidAndUser) {
    return await this.orderRepository.find({
      where: { impUid, user: { id: user.id } },
      relations: ['user'], // user의 포인트 가져오기 위해 join
    });
  }

  /** 결제가 이미 취소됐는지 검증 */
  async checkAlreadyCanceled({
    pointTransactions,
  }: IPointTransactionCheckAlreadyCanceled): Promise<void> {
    const canceledPointTransactions = pointTransactions.filter(
      (el) => el.status === POINT_TRANSACTION_STATUS_ENUM.CANCEL,
    );
    if (canceledPointTransactions.length) {
      throw new HttpException('이미 취소된 결제입니다.', HttpStatus.CONFLICT);
    }
  }

  /** 포인트가 충분히 있는지 검증
   * 유저가 취소를 요청했을때 취소 가능한지 검증
   * paidPointTransactions[0].user.point : 결제한 내역의 유저 포인트, 유저가 결제한 포인트 (취소하려는 포인트)
   * paidPointTransactions[0].orderAmount : 결제한 포인트
   * */
  async checkCancelablePoint({
    pointTransactions,
  }: IPointTransactionCheckHasCancelablePoint): Promise<void> {
    const paidPointTransactions = pointTransactions.filter(
      (el) => el.status === POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
    );
    if (!paidPointTransactions.length) {
      throw new HttpException(
        '결제 기록이 존재하지 않습니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (
      paidPointTransactions[0].user.point < paidPointTransactions[0].orderAmount
    ) {
      throw new HttpException(
        '포인트가 부족합니다.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  /** 결제 취소하기 */
  async cancel({ impUid, user }: IPointCheckTransactionCancel) {
    // 1. 결제내역 조회하기
    const pointTransactions = await this.findByImpUidAndUser({ impUid, user });

    // 2. 이미 취소된 id인지 검증, filter : 배열로 담김
    await this.checkAlreadyCanceled({ pointTransactions });

    // 3. 포인트가 충분히 있는지 검증
    await this.checkCancelablePoint({ pointTransactions });

    // 결제 취소하기
    const canceledAmount = await this.portoneService.cancel({ impUid });

    // 취소된 결과 DB에 등록하기
  }
}
