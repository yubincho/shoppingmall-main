import { Controller, Get, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { RoleGuard } from '../auth/guards/role.guard';
import { RoleEnum } from './entities/role.enum';

@Controller('member')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('all')
  @UseGuards(RoleGuard(RoleEnum.ADMIN))
  async memberGetAll() {
    const members = await this.memberService.getAllMembers();
    return { count: members.length, members };
  }
}
