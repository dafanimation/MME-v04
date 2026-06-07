import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_activity_progress')
export class UserActivityProgress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  activityId: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'in_progress' | 'submitted' | 'validated' | 'returned';

  @Column({ default: 0 })
  progressPercent: number;

  @Column({ nullable: true, type: 'simple-json' })
  completedSteps: string[];

  @Column({ nullable: true, type: 'simple-json' })
  completedCheckmarks: string[];

  @Column({ nullable: true, type: 'real' })
  grade: number;

  @Column({ nullable: true })
  submittedAt: string;

  @Column({ nullable: true })
  validatedBy: string;

  @Column({ nullable: true })
  returnedReason: string;

  @Column({ nullable: true, type: 'simple-json' })
  resourcesUsed: number[];

  @Column()
  createdAt: string;

  @Column()
  updatedAt: string;
}
