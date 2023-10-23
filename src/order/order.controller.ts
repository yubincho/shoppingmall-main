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
    return await this.orderService.create({ impUid, amount, user });
  }
}
