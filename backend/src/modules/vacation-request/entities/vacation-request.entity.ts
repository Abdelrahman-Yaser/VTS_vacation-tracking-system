import { Employee } from '@src/modules/employee/entities/employee.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

export type LeaveType = 'annual' | 'sick' | 'emergency';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

@Entity('vacation_requests')
export class VacationRequest {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  request_id!: string; // رقم الطلب (فريد)

  @ManyToOne(() => Employee, (employee) => employee.vacationRequests)
  @JoinColumn({ name: 'employee_id' })
  employee!: Employee;

  @Column({
    name: 'leave_type',
    type: 'enum',
    enum: ['annual', 'sick', 'emergency'],
    default: 'annual',
  })
  leave_type!: LeaveType; // نوع الإجازة (سنوي، مرضي، طارئ)

  @Column({ name: 'start_date', type: 'date' })
  start_date!: string; // تاريخ البداية

  @Column({ name: 'end_date', type: 'date' })
  end_date!: string; // تاريخ النهاية

  @Column({ name: 'days_requested', type: 'int', default: 0 })
  days_requested!: number; // عدد الأيام المطلوبة

  @Column({
    name: 'manager_status',
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  manager_status!: ApprovalStatus; // حالة المدير

  @Column({
    name: 'hr_status',
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  hr_status!: ApprovalStatus; // حالة الـ HR

  @Column({ name: 'hr_notes', type: 'text', nullable: true })
  hr_notes?: string; // ملاحظات الـ HR

  @Column({
    name: 'final_status',
    type: 'enum',
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  })
  final_status!: ApprovalStatus; // الحالة النهائية للطلب
}
