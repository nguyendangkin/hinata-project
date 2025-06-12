import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  activationCode: string | null;

  @Column({ type: 'timestamp', nullable: true })
  codeExpired: Date | null;
}
