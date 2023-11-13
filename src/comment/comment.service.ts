import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { ProductService } from '../product/product.service';
import { MemberService } from '../member/member.service';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    private readonly memberService: MemberService,
    private readonly productService: ProductService,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    // DTO를 엔터티로 변환
    const user = await this.memberService.getUserById(createCommentDto.user.id);
    console.log('[user]', user);
    const product = await this.productService.getByIdOfProduct(
      createCommentDto.product.id,
    );
    console.log('[product]', product);
    const newComment = this.commentRepository.create({
      content: createCommentDto.content,
      user,
      product,
    });
    // const newComment = await this.commentRepository.create(createCommentDto);
    await this.commentRepository.save(newComment);
    return newComment;
  }

  async getAllComments() {
    const comments = await this.commentRepository.find({
      relations: ['user', 'product'],
    });
    return comments;
  }

  async getCommentById(id: string) {
    console.log('[Comment id #1]', id);
    const comment = await this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
      // relations: ['product'],
    });
    if (!comment) {
      throw new HttpException('No comment', HttpStatus.NOT_FOUND);
    }
    return comment;
  }

  async modifyComment(updateCommentDto: UpdateCommentDto, commentId: string) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id: commentId },
      });

      if (!comment) {
        throw new BadRequestException('찾는 댓글이 존재하지 않습니다.');
      }
      // 기존 댓글 업데이트
      comment.content = updateCommentDto.content;

      // 데이터베이스에 저장
      await this.commentRepository.save(comment);

      return comment;
    } catch (error) {
      console.error(error); // 에러 로깅
      throw new InternalServerErrorException(
        '댓글을 수정하는 중에 오류가 발생했습니다.',
      );
    }
  }

  async deleteOne(id: string) {
    await this.commentRepository.delete(id);
    return 'deleted';
  }
}
