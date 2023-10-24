import {
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import {
  IPortoneServiceCancel,
  IPortOneServiceCheckPaid,
} from './interfaces/portone.service.interface';

@Injectable()
export class PortoneService {
  constructor(private readonly cfg: ConfigService) {}

  /** 토큰 받기 */
  async getToken(): Promise<string> {
    try {
      // 토큰 받기
      const result = await axios.post(`https://api.iamport.kr/users/getToken`, {
        imp_key: this.cfg.get('IMP_KEY'),
        imp_secret: this.cfg.get('IMP_SECRET'),
      });
      return result.data.response.access_token;
    } catch (error) {
      throw new HttpException(
        // portone에서 만든 메시지 그대로 사용함
        error.response.data.message,
        error.response.status,
      );
    }
  }

  /** 단건 조회
   * 결제 됐는지 확인
   * */
  async checkPaid({ impUid, amount }: IPortOneServiceCheckPaid): Promise<void> {
    try {
      const token = await this.getToken();
      const result = await axios.get(
        `https://api.iamport.kr/payments/${impUid}`,
        {
          headers: {
            Authorization: token,
          },
        },
      );
      // 유저의 금액이 맞는지도 확인, 해킹 방지
      if (amount !== result.data.response.amount) {
        throw new UnprocessableEntityException('잘못된 결제 정보입니다.');
      }
    } catch (error) {
      console.log('[error]', error);
      throw new HttpException(
        // portone에서 만든 메시지 그대로 사용함
        error.response.data.message,
        error.response.status,
      );
    }
  }

  /** 결제 취소하기 */
  async cancel({ impUid }: IPortoneServiceCancel): Promise<number> {
    try {
      const token = await this.getToken();
      const result = await axios.post(
        'https://api.iamport.kr/payments/cancel',
        {
          imp_uid: impUid,
        },
        {
          headers: { Authorization: token },
        },
      );
      return result.data.response.cancel_amount; // 취소된 금액 반환
    } catch (error) {
      console.log('[error.response]', error.response);
      throw new HttpException(
        // portone에서 만든 메시지 그대로 사용함
        error.response.data.message,
        error.response.status,
      );
    }
  }
}
