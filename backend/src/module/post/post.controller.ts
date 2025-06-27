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
import { Roles } from 'src/decorator/roles.decorator';
import { Public } from 'src/decorator/mainCommon';

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

  // các api dành cho admin
  @Get('get-all-post')
  @Roles('admin')
  async getAllPost(
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    const currentPage = current ? parseInt(current) : 1;
    const size = pageSize ? parseInt(pageSize) : 10;
    return await this.postService.getAllPosts(currentPage, size);
  }

  @Post('approve-post')
  @Roles('admin')
  async approvePost(@Body('id') id: string) {
    return this.postService.handleApprovePost(id);
  }

  @Post('rejected-post')
  @Roles('admin')
  async rejectedPost(@Body('id') id: string) {
    return this.postService.handleRejectPost(id);
  }

  @Post('ban-user')
  @Roles('admin')
  async banUser(@Body('email') email: string) {
    return this.postService.handleBanUser(email);
  }

  // các api dành cho client công khai
  @Public()
  @Get('get-all-post-for-client')
  async getAllPostForClient(
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
    @Query('search') search?: string,
  ) {
    const currentPage = current ? parseInt(current) : 1;
    const size = pageSize ? parseInt(pageSize) : 10;
    return this.postService.getAllPostForClient(currentPage, size, search);
  }

  @Public()
  @Get('get-a-post')
  async getAPost(@Query('id') id: string) {
    return this.postService.handleGetAPost(id);
  }
}
