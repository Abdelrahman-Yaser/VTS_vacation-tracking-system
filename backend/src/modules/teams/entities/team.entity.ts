import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany, // أضف هذا
  JoinTable, // أضف هذا لإنشاء جدول الربط
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Employee } from '../../employee/entities/employee.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid', { name: 'team_id' })
  team_id!: string;

  @Column('uuid')
  department_id!: string;

  @ManyToOne(() => Department, (department) => department.teams, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'department_id' })
  department!: Department;

  @Column({ name: 'team_name', type: 'varchar', length: 100, nullable: true })
  team_name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string;

  @Column('uuid', { nullable: true })
  team_manager_id?: string;

  @ManyToOne(() => Employee, { nullable: true })
  @JoinColumn({ name: 'team_manager_id' })
  manager!: Employee;

  // --- العلاقة الجديدة لإضافة الموظفين للفريق ---
  @ManyToMany(() => Employee, (employee) => employee.teams)
  @JoinTable({
    name: 'team_members', // اسم الجدول الوسيط في قاعدة البيانات
    joinColumn: { name: 'team_id', referencedColumnName: 'team_id' },
    inverseJoinColumn: { name: 'employee_id', referencedColumnName: 'id' }, // تأكد من اسم العمود في entity الموظف
  })
  members!: Employee[];
  // ------------------------------------------

  @Column({ name: 'team_status' })
  team_status!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
}
