import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { DepartmentService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
// import { CreateTeamDto } from '../teams/dto/create-team.dto';
// import { v4 as uuidv4 } from 'uuid';
// import { Department } from './entities/department.entity';
// import { Employee } from '../employee/entities/employee.entity';
// import { Team } from '../teams/entities/team.entity';

@Controller('departments') // المسار سيكون /departments
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}
  // create team
  // @Post('add-team')
  // async createTeam(@Body() createTeamDto: CreateTeamDto) {
  //   // نقوم بإنشاء الكائن بحيث يحتوي على كل الخصائص المطلوبة في الـ Entity
  //   const teamData = {
  //     team_id: uuidv4(),
  //     team_name: createTeamDto.team_name || '',
  //     description: createTeamDto.description || '',

  //     // 1. إضافة المعرف كخاصية مستقلة (لأن الـ Entity تطلبه)
  //     department_id: createTeamDto.department_id,

  //     // 2. إضافة كائن العلاقة (للتعامل مع العلاقات في TypeORM)
  //     department: { id: createTeamDto.department_id } as Department,

  //     // كرر نفس الأمر للبقية إذا كانت الـ Entity تتطلب الـ IDs أيضاً
  //     team_manager_id: createTeamDto.team_manager_id,
  //     manager: { id: createTeamDto.team_manager_id } as unknown as Employee,
  //     members: createTeamDto.members as unknown as Employee[],
  //     team_status: createTeamDto.team_status, // تأكد من اسم الحقل في الـ Entity

  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   };

  //   return this.departmentService.createTeam(teamData as Team);
  // }
  // create department
  @Post()
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.departmentService.remove(id);
  }
}
