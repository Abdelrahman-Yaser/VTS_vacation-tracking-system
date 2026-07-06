import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const hashpassword = await bcrypt.hash(createEmployeeDto.password, 10);

    const employee = this.employeeRepository.create({
      ...createEmployeeDto,
      password: hashpassword, // ← خزّن الهاش
    });

    return this.employeeRepository.save(employee);
  }

  findAll(): Promise<Employee[]> {
    const employee = this.employeeRepository.find();
    return employee;
  }

  findOne(id: string): Promise<Employee | null> {
    const employee = this.employeeRepository.findOneBy({ id });
    return employee;
  }

  async update(
    id: string,
    UpdateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.preload({
      id,
      ...UpdateEmployeeDto,
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return await this.employeeRepository.save(employee);
  }

  remove(id: number) {
    const deleteEmployee = this.employeeRepository.delete(id);
    return deleteEmployee;
  }
}
