import { Injectable } from '@nestjs/common';
import { Post as PostEntity } from 'src/module/post/entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateManyPostDto } from 'src/module/post/dto/create-many-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly userRepository: Repository<PostEntity>,
  ) {}

  handleCreatePost(data: CreateManyPostDto) {
    // Thay bằng logic lưu DB thật nếu cần
    console.log('Đã nhận:', data);
    return {
      message: 'Đã nhận được danh sách post.',
      total: data.posts.length,
      data: data.posts,
    };
  }
}
