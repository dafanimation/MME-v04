import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('storage_locations')
export class StorageLocation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string;

  @Column()
  zone!: string;

  @Column({ type: 'text', nullable: true })
  row!: string | null;

  @Column({ type: 'text', nullable: true })
  module!: string | null;

  @Column({ type: 'text', nullable: true })
  label!: string | null;

  @Column({ type: 'text', nullable: true })
  room!: string | null;

  @Column({ default: 0 })
  capacity!: number;

  @Column({ default: true })
  active!: boolean;

  @Column({ type: 'simple-json', nullable: true })
  coordinates!: { x: number; z: number; y?: number } | null;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
