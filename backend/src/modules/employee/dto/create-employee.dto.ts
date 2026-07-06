import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsArray,
} from 'class-validator';
import { UserRole } from '../entities/employee.entity';

export class CreateEmployeeDto {
  trim(): any {
    throw new Error('Method not implemented.');
  }
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsStrongPassword()
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  // Manager
  @IsOptional()
  @IsString()
  managerId?: string;

  // Subordinates
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subordinateIds?: string[];

  // Vacations
  @IsNumber()
  vacationDaysAvailable!: number;

  @IsNumber()
  vacationDaysUsed!: number;

  @IsBoolean()
  isActive!: boolean;
}
