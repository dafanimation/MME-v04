import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ud_activities')
export class UdActivity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  udCode!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  date!: string | null;

  @Column({ type: 'text', nullable: true })
  statement!: string | null;

  @Column({ type: 'simple-json', nullable: true })
  requiredEquipment!: string[] | null;

  @Column({ default: 'admin' })
  assignmentMode!: string;

  @Column({ type: 'simple-json', nullable: true })
  resourceTypes!: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  links!: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  images!: string[] | null;

  @Column({ type: 'integer', nullable: true })
  projectId!: number | null;

  @Column({ default: 'planned' })
  status!: string;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
