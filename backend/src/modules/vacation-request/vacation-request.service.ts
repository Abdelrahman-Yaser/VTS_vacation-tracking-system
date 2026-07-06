import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VacationRequest } from './entities/vacation-request.entity';
import { Employee } from '../employee/entities/employee.entity';
import { CreateVacationRequestDto } from './dto/create-vacation-request.dto';
import { UpdateVacationRequestDto } from './dto/update-vacation-request.dto';

interface CurrentUser {
  id: string;
  role: string;
}

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private readonly vacationRequestRepository: Repository<VacationRequest>,

    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // ===============================
  // Create Vacation Request
  // ===============================
  async create(
    dto: CreateVacationRequestDto,
    userId: string,
  ): Promise<VacationRequest> {
    const employee = await this.employeeRepository.findOne({
      where: { id: userId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const vacation = this.vacationRequestRepository.create({
      ...dto,
      employee,
      manager_status: 'Pending',
      hr_status: 'Pending',
      final_status: 'Pending',
    });

    return this.vacationRequestRepository.save(vacation);
  }

  // ===============================
  // Get All Pending Requests for HR/Admin
  // ===============================
  async findHrPendingRequests(userId: string): Promise<VacationRequest[]> {
    return this.vacationRequestRepository.find({
      where: { final_status: 'Pending' },
      relations: { employee: true },
    });
  }

  // ===============================
  // Get All Pending Requests for Manager
  // ===============================
  async findManagerPendingRequests(managerId: string): Promise<VacationRequest[]> {
    return this.vacationRequestRepository
      .createQueryBuilder('vr')
      .leftJoinAndSelect('vr.employee', 'employee')
      .where('employee.manager_id = :managerId', { managerId })
      .andWhere('vr.manager_status = :status', { status: 'Pending' })
      .orderBy('vr.start_date', 'DESC')
      .getMany();
  }

  // ===============================
  // Get All Requests By Employee ID
  // ===============================
  async findByEmployee(empId: string, currentUser: CurrentUser): Promise<VacationRequest[]> {
    // فقط الموظف نفسه أو Admin/HR يمكنهم الوصول
    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'hr' &&
      currentUser.id !== empId
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.vacationRequestRepository
      .createQueryBuilder('vr')
      .where('vr.employee_id = :employeeId', { employeeId: empId })
      .orderBy('vr.start_date', 'DESC')
      .getMany();
  }

  // ===============================
  // Update Vacation Request (Manager / HR / Admin)
  // ===============================
  async update(
    request_id: string,
    dto: UpdateVacationRequestDto,
    currentUser: CurrentUser,
  ): Promise<VacationRequest> {
    return this.vacationRequestRepository.manager.transaction(
      async (manager) => {
        const request = await manager
          .createQueryBuilder(VacationRequest, 'vr')
          .innerJoinAndSelect('vr.employee', 'employee')
          .where('vr.request_id = :request_id', { request_id })
          .setLock('pessimistic_write')
          .getOne();

        if (!request) throw new NotFoundException('Request not found');
        if (request.final_status !== 'Pending') {
          throw new ForbiddenException('Cannot update a closed request');
        }

        const role = currentUser.role.toLowerCase();

        if (role === 'manager') {
          if (dto.manager_status) {
            request.manager_status = dto.manager_status;
            if (dto.manager_status === 'Rejected') request.final_status = 'Rejected';
          }
        } else if (role === 'hr' || role === 'admin') {
          if (dto.hr_status) request.hr_status = dto.hr_status;
          if (dto.hr_notes) request.hr_notes = dto.hr_notes;

          // المنطق النهائي للاعتماد
          if (dto.hr_status === 'Approved') {
            const employee = request.employee;
            const requestedDays = Number(request.days_requested);
            if (employee.vacationDaysAvailable < requestedDays) {
              throw new ForbiddenException('Insufficient vacation balance');
            }

            employee.vacationDaysAvailable -= requestedDays;
            employee.vacationDaysUsed += requestedDays;

            await manager.save(Employee, employee);
            request.final_status = 'Approved';
          } else if (dto.hr_status === 'Rejected') {
            request.final_status = 'Rejected';
          }
        }

        return manager.save(VacationRequest, request);
      },
    );
  }

  // ===============================
  // Delete Request (Admin Only)
  // ===============================
  async remove(request_id: string): Promise<void> {
    const result = await this.vacationRequestRepository.delete({ request_id });
    if (result.affected === 0)
      throw new NotFoundException(`VacationRequest ${request_id} not found`);
  }
}
