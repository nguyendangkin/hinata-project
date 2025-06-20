import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bankAccountName: string;

  @Column()
  bankAccountNumber: string;

  @Column()
  bankName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  facebookProfileLink: string;

  @Column({ nullable: true })
  complaintLink: string;

  @Column('text', { array: true, default: [] })
  imagePaths: string[];

  @Column({ nullable: true, type: 'text' })
  personalComment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
