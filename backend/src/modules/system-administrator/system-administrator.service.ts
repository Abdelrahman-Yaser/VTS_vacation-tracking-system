import { Injectable } from '@nestjs/common';
import { CreateSystemAdministratorDto } from './dto/create-system-administrator.dto';
import { UpdateSystemAdministratorDto } from './dto/update-system-administrator.dto';

@Injectable()
export class SystemAdministratorService {
  create(createSystemAdministratorDto: CreateSystemAdministratorDto) {
    return 'This action adds a new systemAdministrator';
  }

  findAll() {
    return `This action returns all systemAdministrator`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemAdministrator`;
  }

  update(id: number, updateSystemAdministratorDto: UpdateSystemAdministratorDto) {
    return `This action updates a #${id} systemAdministrator`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemAdministrator`;
  }
}
