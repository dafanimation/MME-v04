import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  group: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: true })
  active: boolean;

  @Column({ nullable: true })
  kingdom: string;

  @Column()
  createdAt: string;
}
