import {
  IsString,
  IsOptional,
  IsUUID,
  Length,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO فرعي لبيانات الفريق عند الإنشاء مع القسم
class CreateTeamNestedDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateDepartmentDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsOptional()
  @IsUUID()
  managerId?: string;

  @IsOptional()
  @IsUUID()
  hrId?: string;
  // إضافة مصفوفة الفرق
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // للتحقق من كل عنصر داخل المصفوفة
  @Type(() => CreateTeamNestedDto) // ضروري لتحويل البيانات لنوع الـ DTO الصحيح
  teams?: CreateTeamNestedDto[];
}
