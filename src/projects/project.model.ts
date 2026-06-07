import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ default: 'draft' })
  status!: string;

  @Column({ type: 'simple-json', nullable: true })
  dossierLinks!: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  attachments!: string[] | null;

  @Column({ type: 'simple-json', nullable: true })
  participants!: string[] | null;

  @Column({ type: 'text', nullable: true })
  mesaNum!: string | null;

  @Column({ type: 'text', nullable: true })
  createdByEmail!: string | null;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
