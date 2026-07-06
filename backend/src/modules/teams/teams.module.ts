import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Department } from '../departments/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Employee, Department])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
