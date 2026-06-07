import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

type ResourceLocation = {
  x: number;
  z: number;
  type?: string;
  tipo?: string;
  label?: string;
  mesaId?: number;
  num?: number;
  estId?: string;
  room?: string;
  placement?: string;
  anchor?: string;
  renderAnchorIndex?: number | null;
};

@Entity('resources')
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column({ nullable: true })
  name!: string;

  @Column({ nullable: true })
  os!: string;

  @Column({ nullable: true })
  cpu!: string;

  @Column({ nullable: true })
  ghz!: string;

  @Column({ nullable: true, type: 'integer' })
  bits!: number;

  @Column({ nullable: true })
  motherboard!: string;

  @Column({ nullable: true })
  ram!: string;

  @Column({ nullable: true })
  storage!: string;

  @Column({ nullable: true })
  qrCode!: string;

  @Column({ nullable: true })
  extras!: string;

  @Column({ nullable: true })
  notes!: string;

  @Column({ default: 'available' })
  status!: string;

  @Column({ nullable: true })
  type!: string;

  // CORREGIT: Tipus explícit 'integer' per SQLite
  @Column({ nullable: true, type: 'integer' })
  assignedToUserId!: number | null;

  @Column()
  createdAt!: string;

  @Column({ nullable: true })
  driveLink!: string;

  @Column({ nullable: true, type: 'simple-json' })
  location!: ResourceLocation | null;
}
