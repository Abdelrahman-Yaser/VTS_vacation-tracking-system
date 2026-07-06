import { Module } from '@nestjs/common';
import { DepartmentService } from './departments.service';
import { DepartmentController } from './departments.controller';
import { Employee } from '../employee/entities/employee.entity';
import { Department } from './entities/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Team } from '../teams/entities/team.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Department, Employee, Team])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentsModule {}
