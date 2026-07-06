import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequestService } from './vacation-request.service';
import { VacationRequestController } from './vacation-request.controller';
import { VacationRequest } from './entities/vacation-request.entity';
import { Employee } from '../employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest, Employee])], // <-- مهم جدًا
  controllers: [VacationRequestController],
  providers: [VacationRequestService],
  exports: [VacationRequestService],
})
export class VacationRequestModule {}
