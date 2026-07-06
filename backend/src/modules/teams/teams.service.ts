import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(dto: CreateTeamDto): Promise<Team> {
    // 1. Check Department
    const department = await this.departmentRepository.findOneBy({
      id: dto.department_id,
    });
    if (!department) throw new NotFoundException('Department not found');

    // 2. NEW: Check if Manager exists (if provided)
    let manager = null;
    if (dto.team_manager_id) {
      manager = await this.employeeRepository.findOneBy({
        id: dto.team_manager_id,
      });
      if (!manager) throw new NotFoundException('Manager (Employee) not found');
    }

    // 3. Fetch Members
    const members = await this.employeeRepository.find({
      where: { id: In(dto.members || []) },
    });

    // 4. Create Team
    const team = this.teamRepository.create({
      team_id: undefined, // ensure new entity
      team_name: dto.team_name,
      description: dto.description,
      team_status: dto.team_status,
      manager: manager ?? undefined,
      department: department,
      members: members,
    });

    const savedTeam = await this.teamRepository.save(team);
    // Team may be array or object depending on usage, get proper ID
    return this.findOne(savedTeam.team_id);
  }
  async findAll(): Promise<Team[]> {
    return await this.teamRepository.find({
      relations: ['members', 'department', 'manager'],
    });
  }

  async findOne(team_id: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { team_id },
      relations: ['members', 'department', 'manager'],
    });
    if (!team) throw new NotFoundException(`Team with ID ${team_id} not found`);
    return team;
  }

  async update(team_id: string, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(team_id);

    // تحديث البيانات الأساسية
    if (dto.team_name) team.team_name = dto.team_name;
    if (dto.description) team.description = dto.description;
    if (dto.team_status) team.team_status = dto.team_status;

    // تحديث الأعضاء إذا تم إرسال مصفوفة جديدة
    if (dto.members) {
      team.members = await this.employeeRepository.find({
        where: { id: In(dto.members) },
      });
    }

    const updatedTeam = await this.teamRepository.save(team);
    return this.findOne(updatedTeam.team_id);
  }

  async remove(team_id: string): Promise<void> {
    const result = await this.teamRepository.delete(team_id);
    if (result.affected === 0) throw new NotFoundException(`Team not found`);
  }
}
