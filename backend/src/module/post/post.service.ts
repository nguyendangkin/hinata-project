import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async handleCreatePost(data: CreatePostDto, files: Express.Multer.File[]) {
    const savedPosts: PostEntity[] = [];

    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      const imageFiles = files.filter(
        (f) => f.fieldname === `items[${i}][proofFiles][]`,
      );

      const imagePaths: string[] = [];
      for (const file of imageFiles) {
        const ext = path.extname(file.originalname);
        const fileName = `${uuidv4()}${ext}`;
        const uploadDir = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });

        const uploadPath = path.join(uploadDir, fileName);
        fs.writeFileSync(uploadPath, file.buffer);

        imagePaths.push(`/uploads/${fileName}`);
      }

      const post = this.postRepository.create({
        bankAccountName: item.bankAccountName,
        bankAccountNumber: item.bankAccountNumber,
        bankName: item.bankName,
        phoneNumber: item.phoneNumber,
        facebookProfileLink: item.facebookProfileLink,
        complaintLink: item.complaintLink,
        personalComment: item.personalComment,
        imagePaths,
      });

      const saved = await this.postRepository.save(post);
      savedPosts.push(saved);
    }

    return {
      message: `${savedPosts.length} bài post đã được lưu thành công!`,
      data: savedPosts,
    };
  }
}
