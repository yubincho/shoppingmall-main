import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberController } from './member.controller';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async getAllMembers() {
    const members = await this.memberRepository.find();
    return members;
  }

  async getUserById(id: string) {
    const user = await this.memberRepository.findOneBy({ id });
    if (user) return user;
    throw new HttpException('No User', HttpStatus.NOT_FOUND);
  }

  async getUserByEmail(email: string) {
    const user = await this.memberRepository.findOneBy({ email });
    if (user) return user;
    throw new HttpException('No User', HttpStatus.NOT_FOUND);
  }

  async registerMember(createMemberDto: CreateMemberDto) {
    // const { email } = createMemberDto;
    // const existingMember = await this.memberRepository.findOne({
    //   where: { email },
    // });
    //
    // if (existingMember) {
    //   throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    // }
    //
    // const newMember: Member = this.memberRepository.create(createMemberDto);
    // return this.memberRepository.save(newMember);

    const newUser = await this.memberRepository.create(createMemberDto);
    await this.memberRepository.save(newUser);
    return newUser;
  }
}
