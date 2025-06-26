import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from 'src/module/post/entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/module/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => UserModule)],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
