import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('whitelist')
export class WhitelistEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  academicYear: string;   // "2025-26", "2026-27"

  @Column({ nullable: true })
  module: string;         // "MME", "SOX"

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: true })
  canEdit: boolean;       // false = curs tancat (mode consulta)

  @Column({ nullable: true })
  approvedBy: string;

  @Column()
  approvedAt: string;
}
