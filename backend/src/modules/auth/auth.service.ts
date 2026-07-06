import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../employee/entities/employee.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateSignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
  ) {}

  // ===============================
  // Sign In
  // ===============================
  async signIn(
    email: string,
    password: string,
  ): Promise<{ employee: Omit<Employee, 'password'>; access_token: string }> {
    const employee = await this.employeeRepository.findOne({
      where: { email },
      select: [
        'id',
        'email',
        'role',
        'password',
        'firstName',
        'lastName',
        'vacationDaysUsed',
        'vacationDaysAvailable',
      ],
    });

    if (!employee) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role,
    };

    // إزالة الباسورد من الريسبونس
    const { password: _, ...safeEmployee } = employee;

    return {
      employee: safeEmployee,
      access_token: this.jwtService.sign(payload),
    };
  }

  // ===============================
  // Sign Up
  // ===============================
  async signUp(
    dto: CreateSignUpDto,
  ): Promise<{ employee: Omit<Employee, 'password'>; access_token: string }> {
    const exists = await this.employeeRepository.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const employee = this.employeeRepository.create({
      ...dto,
      password: hashedPassword,
    });

    await this.employeeRepository.save(employee);

    const payload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role,
    };

    const { password: _, ...safeEmployee } = employee;

    return {
      employee: safeEmployee,
      access_token: this.jwtService.sign(payload),
    };
  }
}
