import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const newComment = await this.commentRepository.create(createCommentDto);
    await this.commentRepository.save(newComment);
    return newComment;
  }

  async getAllComments() {
    const comments = await this.commentRepository.find({
      relations: ['user', 'product'],
    });
    return comments;
  }

  async getCommentById(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException('찾는 댓글이 존재하지 않습니다.');
    }
    return comment;
  }

  async modifyComment(commentId: string) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });

    if (!comment) {
      throw new BadRequestException('찾는 댓글이 존재하지 않습니다.');
    }

    await this.commentRepository.save(comment);
    return comment;
  }
}
