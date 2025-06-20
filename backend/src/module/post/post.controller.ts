import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('post')
export class PostController {
  @Post('create')
  @UseInterceptors(AnyFilesInterceptor())
  create(@UploadedFiles() files: Express.Multer.File[], @Body() data: any) {
    console.log('data', data); // 👉 bây giờ sẽ có dữ liệu
    console.log('files', files); // 👉 các ảnh được upload
    return 'oke';
  }
}
