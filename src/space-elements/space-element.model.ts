import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type SpaceElementAssignment = {
  userEmail?: string;
  mesaNum?: string;
  activityCode?: string;
  projectName?: string;
  screenLink?: string;
  updatedAt?: string;
};

@Entity('space_elements')
export class SpaceElement {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  room!: string;

  @Column()
  elementUid!: string;

  @Column({ nullable: true })
  template!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  shape!: string;

  @Column({ type: 'simple-json', nullable: true })
  dims!: number[] | null;

  @Column({ type: 'real', default: 0 })
  x!: number;

  @Column({ type: 'real', default: 0 })
  z!: number;

  @Column({ type: 'real', default: 0 })
  yOffset!: number;

  @Column({ type: 'real', default: 0 })
  rotationY!: number;

  @Column({ nullable: true })
  borderColor!: string;

  @Column({ nullable: true })
  fillColor!: string;

  @Column({ type: 'real', default: 0.25 })
  fillOpacity!: number;

  @Column({ type: 'simple-json', nullable: true })
  assignment!: SpaceElementAssignment | null;

  @Column({ type: 'text', nullable: true })
  createdByEmail!: string | null;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
