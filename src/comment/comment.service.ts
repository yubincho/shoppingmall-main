import { Injectable } from '@nestjs/common';
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
}
