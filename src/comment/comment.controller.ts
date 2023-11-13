import {
  Body,
  Controller,
  Delete,
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
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
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

  @Get(':id')
  async getCommentById(@Param('id') id: string) {
    console.log('[Comment id]', id);
    return await this.commentService.getCommentById(id);
  }

  @Post('update/:commentId')
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUserInterface,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentService.modifyComment(updateCommentDto, commentId);
  }

  @Delete('delete/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Param('commentId') commentId: string,
    @Req() req: RequestWithUserInterface,
  ) {
    return await this.commentService.deleteOne(commentId);
  }
}
