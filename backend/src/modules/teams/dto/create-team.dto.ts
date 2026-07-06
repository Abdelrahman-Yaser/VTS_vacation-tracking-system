import {
  IsUUID,
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  ArrayMinSize,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Department UUID that this team belongs to',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID('4', { message: 'department_id must be a valid UUID' })
  @IsNotEmpty({ message: 'department_id is required' })
  department_id!: string;

  @ApiProperty({
    description: 'Team name',
    example: 'Backend Development Team',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'team_name is required' })
  @MinLength(3, { message: 'team_name must be at least 3 characters' })
  @MaxLength(100, { message: 'team_name must not exceed 100 characters' })
  team_name!: string;

  @ApiPropertyOptional({
    description: 'Team description',
    example: 'Responsible for backend API development and maintenance',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({
    description: 'Team manager UUID (must be an employee)',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsUUID('4', { message: 'team_manager_id must be a valid UUID' })
  @IsNotEmpty({ message: 'team_manager_id is required' })
  team_manager_id!: string;

  @ApiProperty({
    description: 'Array of employee UUIDs who are members of this team',
    example: [
      '550e8400-e29b-41d4-a716-446655440003',
      '550e8400-e29b-41d4-a716-446655440004',
      '550e8400-e29b-41d4-a716-446655440005',
    ],
    type: [String],
    isArray: true,
  })
  @IsArray({ message: 'members must be an array' })
  @ArrayMinSize(1, { message: 'At least one team member is required' })
  @IsUUID('4', {
    each: true,
    message: 'Each member must be a valid UUID',
  })
  members!: string[];

  @ApiPropertyOptional({
    description: 'Team status',
    enum: ['active', 'inactive'],
    default: 'active',
    example: 'active',
  })
  @IsOptional()
  @IsEnum(['active', 'inactive'], {
    message: 'team_status must be either active or inactive',
  })
  team_status?: 'active' | 'inactive';
}
