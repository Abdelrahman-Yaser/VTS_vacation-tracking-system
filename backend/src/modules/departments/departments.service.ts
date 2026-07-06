import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Employee } from '../employee/entities/employee.entity';
import { Team } from '../teams/entities/team.entity';
// import { CreateTeamDto } from '../teams/dto/create-team.dto';
// import { CreateEmployeeDto } from '../employee/dto/create-employee.dto';
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}
  // async createTeam(dto: CreateTeamDto): Promise<Team> {
  //   const department = await this.departmentRepository.findOneBy({
  //     id: dto.department_id,
  //   });
  //   if (!department) throw new NotFoundException('Department not found');

  //   // 1. تنظيف الـ IDs من المسافات
  //   const memberIds = Array.isArray(dto.members)
  //     ? dto.members.map((id: CreateEmployeeDto) => id.trim())
  //     : [];
  //   // 2. فحص هل الموظفين موجودين فعلاً؟
  //   const members = await this.employeeRepository.find({
  //     where: { id: In(memberIds) },
  //   });

  //   const team = this.teamRepository.create({
  //     team_name: dto.team_name,
  //     description: dto.description,
  //     team_status: dto.team_status,
  //     team_manager_id: dto.team_manager_id,
  //     department: department,
  //     members: members,
  //   });

  //   const savedTeam = await this.teamRepository.save(team);

  //   const teamWithRelations = await this.teamRepository.findOne({
  //     where: { team_id: savedTeam.team_id },
  //     relations: ['members', 'department'],
  //   });

  //   if (!teamWithRelations) throw new NotFoundException('Team not found');

  //   return teamWithRelations;
  // }

  async create(dto: CreateDepartmentDto): Promise<Department> {
    // إنشاء كائن القسم مع الفرق (إن وجدت)
    const department = this.departmentRepository.create({
      name: dto.name,
      teams: dto.teams, // سيتم إنشاؤها تلقائياً بفضل الـ cascade
    });

    // ربط المدير والـ HR بالمعرفات (IDs)
    if (dto.managerId) {
      department.manager = { id: dto.managerId } as Employee;
    }

    if (dto.hrId) {
      department.hr = { id: dto.hrId } as Employee;
    }

    return await this.departmentRepository.save(department);
  }

  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find({
      relations: [
        'manager',
        'hr',
        'teams',
        'teams.manager', // مهم جداً لعرض الموظفين داخل كل فريق
      ],
    });
  }

  async findOne(id: string): Promise<Department> {
    const dept = await this.departmentRepository.findOne({
      where: { id },
      relations: ['manager', 'hr', 'teams'],
    });
    if (!dept) throw new NotFoundException('Department not found');
    return dept;
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<Department> {
    const dept = await this.findOne(id);

    if (dto.name) dept.name = dto.name;
    if (dto.managerId) {
      dept.manager =
        (await this.employeeRepository.findOneBy({ id: dto.managerId })) ||
        undefined;
    }
    if (dto.hrId) {
      dept.hr =
        (await this.employeeRepository.findOneBy({ id: dto.hrId })) ||
        undefined;
    }

    return await this.departmentRepository.save(dept);
  }

  async remove(id: string): Promise<void> {
    const result = await this.departmentRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Department not found');
  }
}
