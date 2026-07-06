import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { LeaveType, ApprovalStatus } from '../entities/vacation-request.entity';
import { Transform } from 'class-transformer';

export class CreateVacationRequestDto {
  @IsUUID()
  employee_id!: string;

  @IsEnum(['annual', 'sick', 'emergency'])
  leave_type!: LeaveType;

  @IsDateString()
  start_date!: string;

  @IsDateString()
  end_date!: string;

  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  manager_status?: ApprovalStatus;

  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  hr_status?: ApprovalStatus;

  @IsOptional()
  @IsString()
  hr_notes?: string;

  @IsOptional()
  @IsEnum(['Pending', 'Approved', 'Rejected'])
  @Transform(({ value }: { value: string }) => value?.trim())
  final_status?: ApprovalStatus;
}
