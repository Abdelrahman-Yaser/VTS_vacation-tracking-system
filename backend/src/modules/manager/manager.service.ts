import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateManagerDto } from './dto/update-manager.dto';

@Injectable()
export class ManagerService {
  create(createManagerDto: CreateManagerDto) {
    return 'This action adds a new manager' + JSON.stringify(createManagerDto);
  }

  findAll() {
    return `This action returns all manager`;
  }

  findOne(id: number) {
    return `This action returns a #${id} manager`;
  }

  update(id: number, updateManagerDto: UpdateManagerDto) {
    return (
      `This action updates a #${id} manager => ` +
      JSON.stringify(updateManagerDto)
    );
  }

  remove(id: number) {
    return `This action removes a #${id} manager`;
  }
}
