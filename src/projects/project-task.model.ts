import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('project_tasks')
export class ProjectTask {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  projectId!: number;

  @Column({ type: 'integer', nullable: true })
  udActivityId!: number | null;

  @Column({ type: 'text', nullable: true })
  activityCode!: string | null;

  @Column({ type: 'text', nullable: true })
  ownerUserEmail!: string | null;

  @Column({ type: 'text', nullable: true })
  mesaNum!: string | null;

  @Column({ type: 'text', nullable: true })
  resourceCode!: string | null;

  @Column({ default: 'pending' })
  status!: string;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
