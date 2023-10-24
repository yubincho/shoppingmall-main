import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /** 결제 생성, 결제하기 */
  @Post('')
  @UseGuards(JwtAuthGuard)
  async createOrderTransaction(
    // @Param('impUid') impUid: string,
    // @Param('amount') amount: number,
    @Body() requestBody: { impUid: string; amount: number },
    @Req() req: RequestWithUserInterface,
  ) {
    const { impUid, amount } = requestBody;
    const user = req.user;
    return await this.orderService.createForPayment({ impUid, amount, user });
  }

  /** 결제 취소하기 */
  @Post('')
  @UseGuards(JwtAuthGuard)
  async cancelOrderTransaction(
    @Param('impUid') impUid: string,
    @Req() req: RequestWithUserInterface,
  ) {
    const user = req.user;
    return await this.orderService.cancel({ impUid, user });
  }
}
