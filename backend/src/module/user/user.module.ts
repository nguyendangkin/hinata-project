import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/user/entities/user.entity';
import { HttpModule } from '@nestjs/axios';
import { PostModule } from 'src/module/post/post.module';
import { Post } from 'src/module/post/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post]),
    HttpModule,
    forwardRef(() => PostModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
