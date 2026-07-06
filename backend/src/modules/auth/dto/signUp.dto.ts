import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

export class CreateSignUpDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsArray()
  subordinateIds?: string[];

  @IsOptional()
  @IsNumber()
  vacationDaysAvailable?: number;

  @IsOptional()
  @IsNumber()
  vacationDaysUsed?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
