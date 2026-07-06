import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// import { Employee } from '../../employee/entities/employee.entity';

@Entity('')
export class systemRdministrator {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column({ type: 'int' })
  daysRequested!: number;

  @Column({ type: 'boolean', default: false })
  approved!: boolean;

  // Relation مع الموظف
  //   @ManyToOne(() => Employee, (employee) => employee.vacationRequests)
  //   employee!: Employee;
}
