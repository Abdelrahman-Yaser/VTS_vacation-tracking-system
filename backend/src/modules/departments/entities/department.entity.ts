import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // UUID primary key

  @Column({ length: 100 })
  name!: string; // Department name

  // Manager relation (nullable)
  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'manager_id' })
  manager?: Employee; // optional, could be undefined

  // HR relation (nullable)
  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'hr_id' })
  hr?: Employee; // optional, could be undefined

  // Teams relation
  @OneToMany(() => Team, (team: Team) => team.department, {
    cascade: ['insert', 'update'],
  })
  teams!: Team[]; // optional, could be empty or undefined

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}
