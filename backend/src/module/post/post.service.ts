import { Injectable } from '@nestjs/common';
import { Post as PostEntity } from 'src/module/post/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from 'src/module/post/dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  handleCreatePost(data: CreatePostDto) {
    return {
      message: 'Đã nhận được danh sách post.',
    };
  }
}
