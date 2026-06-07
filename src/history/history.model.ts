import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('history')
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ nullable: true })
  userName: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  resourceId: number;

  @Column({ nullable: true })
  resourceCode: string;

  @Column({ nullable: true })
  details: string;

  // Extended fields
  @Column({ nullable: true })
  activityId: string;

  @Column({ nullable: true })
  oldValue: string;

  @Column({ nullable: true })
  newValue: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  createdBy: string;

  @Column({ nullable: true, type: 'simple-json' })
  metadata: object;

  @Column()
  createdAt: string;
}
