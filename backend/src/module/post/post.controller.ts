import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() data: CreatePostDto,
    @Req() req,
  ) {
    const user = req.user; // Lấy user từ request
    return this.postService.handleCreatePost(data, files, user);
  }

  @Get('get-all-post')
  async getAllPost(
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const currentPage = current ? parseInt(current) : 1;
    const size = pageSize ? parseInt(pageSize) : 10;
    return await this.postService.getAllPosts(currentPage, size);
  }
}
