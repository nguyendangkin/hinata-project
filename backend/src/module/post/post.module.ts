import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from 'src/module/post/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/module/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
