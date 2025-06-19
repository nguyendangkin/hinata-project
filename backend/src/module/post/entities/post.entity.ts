import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
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

  @Column('text', { array: true })
  imagePath: string[];

  @Column({ nullable: true })
  personalComment: string;
}
