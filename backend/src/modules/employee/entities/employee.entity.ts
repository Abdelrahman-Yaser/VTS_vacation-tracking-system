import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne, // <--- نحتاجها لربط الموظف بمديره
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { VacationRequest } from '../../vacation-request/entities/vacation-request.entity';
import { Team } from '@src/modules/teams/entities/team.entity';

// 1. تعريف الأدوار (Roles) عشان نعرف مين HR ومين مدير
export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  HR = 'hr',
  ADMIN = 'admin',
  SYSTEM_ADMINISTRATOR = 'system_administrator',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, nullable: true })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ unique: true, length: 150 })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  hireDate!: Date;

  // 2. إضافة عمود الدور (Role)
  // هذا أهم عمود عشان الـ HR يشوف كل الطلبات، والمدير يشوف طلبات فريقه بس
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role!: UserRole;

  // 3. علاقة الموظف بمديره (Self-Referencing Relation)
  // كل موظف له مدير واحد (ManyToOne)
  @ManyToOne(() => Employee, (employee) => employee.subordinates, {
    nullable: true,
  })
  @JoinColumn({ name: 'managerId' }) // اسم العمود في الداتا بيز هيكون managerId
  manager?: Employee;

  @Column({ nullable: true })
  managerId?: string; // مفيد جداً لو عايز تجيب آيدي المدير بس من غير ما تعمل Join

  // 4. علاقة المدير بموظفيه (عكس اللي فوق)
  // المدير الواحد عنده موظفين كتير (OneToMany)
  @OneToMany(() => Employee, (employee) => employee.manager)
  subordinates?: Employee[];

  @Column({ type: 'int', default: 0 })
  vacationDaysAvailable!: number;

  @Column({ type: 'int', default: 0 })
  vacationDaysUsed!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => VacationRequest, (request) => request.employee)
  vacationRequests!: VacationRequest[];
  @ManyToMany(() => Team, (team) => team.members)
  teams!: Team[]; // علاقة عكسية تسمح للموظف بمعرفة الفرق المشترك فيها
}
