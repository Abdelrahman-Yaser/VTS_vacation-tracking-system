import { IsDateString, IsEnum, IsString } from 'class-validator';
import { ApprovalStatus, LeaveType } from '../entities/vacation-request.entity';

export class UpdateVacationRequestDto {
  @IsEnum(['annual', 'sick', 'emergency'])
  leave_type?: LeaveType;

  @IsDateString()
  start_date?: string;

  @IsDateString()
  end_date?: string;

  @IsEnum(['Pending', 'Approved', 'Rejected'])
  manager_status?: ApprovalStatus;

  @IsEnum(['Pending', 'Approved', 'Rejected'])
  hr_status?: ApprovalStatus;

  @IsString()
  hr_notes?: string;

  @IsEnum(['Pending', 'Approved', 'Rejected'])
  final_status?: ApprovalStatus;
}
