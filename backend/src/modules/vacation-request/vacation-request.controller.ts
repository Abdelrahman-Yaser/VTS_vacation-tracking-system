import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VacationRequestService } from './vacation-request.service';
import { CreateVacationRequestDto } from './dto/create-vacation-request.dto';
import { UpdateVacationRequestDto } from './dto/update-vacation-request.dto';
import { JwtAuthGuard } from '../../guards/auth-guard';
import { Role } from '@src/guards/roles.decorator';
import { GetUser } from '@src/decorators/get-user.decorator';
import { Employee } from '../employee/entities/employee.entity';

@Controller('vacation-request')
@UseGuards(JwtAuthGuard)
export class VacationRequestController {
  constructor(
    private readonly vacationRequestService: VacationRequestService,
  ) {}

  // ===============================
  // Create Vacation Request
  // ===============================
  @Post()
  @Role('employee', 'hr', 'admin')
  create(@Body() dto: CreateVacationRequestDto, @GetUser() user: Employee) {
    return this.vacationRequestService.create(dto, user.id);
  }

  // ===============================
  // Get All Pending Requests for HR/Admin
  // ===============================
  @Get('pending')
  @Role('hr', 'admin')
  getHrPendingRequests(@GetUser() user: Employee) {
    // Backend decides which requests HR/Admin can see
    return this.vacationRequestService.findHrPendingRequests(user.id);
  }

  // ===============================
  // Get All Pending Requests for Manager
  // ===============================
  @Get('manager/pending')
  @Role('manager')
  getManagerPendingRequests(@GetUser() user: Employee) {
    // Backend filters requests assigned to this manager
    return this.vacationRequestService.findManagerPendingRequests(user.id);
  }

  // ===============================
  // Get Requests By Employee ID (self or admin)
  // ===============================
  @Get('employee/:empId')
  @Role('employee', 'hr', 'admin')
  getEmployeeVacations(
    @Param('empId') empId: string,
    @GetUser() user: Employee,
  ) {
    // Backend checks if user can view this employee's requests
    return this.vacationRequestService.findByEmployee(empId, user);
  }

  // ===============================
  // Update Request (Manager / HR / Admin)
  // ===============================
  @Patch(':requestId')
  @Role('manager', 'hr', 'admin')
  update(
    @Param('requestId') requestId: string,
    @Body() dto: UpdateVacationRequestDto,
    @GetUser() user: Employee,
  ) {
    return this.vacationRequestService.update(requestId, dto, user);
  }

  // ===============================
  // Delete Request (Admin Only)
  // ===============================
  @Delete(':requestId')
  @Role('admin')
  remove(@Param('requestId') requestId: string) {
    return this.vacationRequestService.remove(requestId);
  }
}
