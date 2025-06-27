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
import {
  ApprovePostDto,
  BanUserDto,
  CreatePostDto,
  GetAPostDto,
  PaginationDto,
} from './dto/create-post.dto';
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
  async getAllPost(@Query() query: PaginationDto) {
    return await this.postService.getAllPosts(query.current, query.pageSize);
  }

  @Post('approve-post')
  @Roles('admin')
  async approvePost(@Body() body: ApprovePostDto) {
    return this.postService.handleApprovePost(body.id.toString());
  }

  @Post('rejected-post')
  @Roles('admin')
  async rejectedPost(@Body() body: ApprovePostDto) {
    return this.postService.handleRejectPost(body.id.toString());
  }

  @Post('ban-user')
  @Roles('admin')
  async banUser(@Body() body: BanUserDto) {
    return this.postService.handleBanUser(body.email);
  }

  // các api dành cho client công khai
  @Public()
  @Get('get-all-post-for-client')
  async getAllPostForClient(
    @Query() query: PaginationDto,
    @Query('search') search?: string,
  ) {
    return this.postService.getAllPostForClient(
      query.current,
      query.pageSize,
      search,
    );
  }

  @Public()
  @Get('get-a-post')
  async getAPost(@Query() query: GetAPostDto) {
    return this.postService.handleGetAPost(query.id.toString());
  }

  //
  @Get('get-my-posts')
  async getMyPosts(@Req() req, @Query() query: PaginationDto) {
    const user = req.user;
    return this.postService.handleGetAllPostForProfile(
      user,
      query.current,
      query.pageSize,
    );
  }
}
