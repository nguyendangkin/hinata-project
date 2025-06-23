import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { User } from 'src/module/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async handleCreatePost(
    data: CreatePostDto,
    files: Express.Multer.File[],
    user: User,
  ) {
    // Lặp qua từng item trong data để xử lý từng bài post
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];

      // Lọc ra các file ảnh tương ứng với từng item
      const imageFiles = files.filter(
        (f) => f.fieldname === `items[${i}][proofFiles][]`,
      );

      // khai báo mảng để lưu đường dẫn ảnh
      const imagePaths: string[] = [];
      for (const file of imageFiles) {
        // Lấy phần mở rộng file
        const ext = path.extname(file.originalname);
        // Tạo tên file ngẫu nhiên
        const fileName = `${uuidv4()}${ext}`;
        // Đảm bảo thư mục uploads tồn tại
        const uploadDir = path.join(process.cwd(), 'uploads');
        fs.mkdirSync(uploadDir, { recursive: true });

        // Đường dẫn lưu file
        const uploadPath = path.join(uploadDir, fileName);
        // Ghi file vào thư mục uploads
        fs.writeFileSync(uploadPath, file.buffer);

        // Lưu đường dẫn file để lưu vào DB
        imagePaths.push(`/uploads/${fileName}`);
      }

      // Tạo entity post mới từ dữ liệu và đường dẫn ảnh
      const post = this.postRepository.create({
        bankAccountName: item.bankAccountName,
        bankAccountNumber: item.bankAccountNumber,
        bankName: item.bankName,
        phoneNumber: item.phoneNumber,
        facebookProfileLink: item.facebookProfileLink,
        complaintLink: item.complaintLink,
        imagePaths,
        personalComment: item.personalComment,
        status: 'pending',
        user,
      });

      // Lưu post vào database
      const saved = await this.postRepository.save(post);
    }

    return {
      message: `Các bài đã được gửi đi thành công`,
    };
  }
}
