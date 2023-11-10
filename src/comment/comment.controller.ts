import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUserInterface } from '../auth/interfaces/requestWithUser.interface';

@Controller('products/:productId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Req() req: RequestWithUserInterface,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment({
      ...createCommentDto,
      user: req.user,
    });
  }

  @Get()
  async getAllComments() {
    return await this.commentService.getAllComments();
  }

  @Get(':/commentId')
  async getCommentById(@Param() commentId: string) {
    return await this.commentService.getCommentById(commentId);
  }

  @Post('/:commentId')
  async updateComment(@Param() commentId: string) {}
}
