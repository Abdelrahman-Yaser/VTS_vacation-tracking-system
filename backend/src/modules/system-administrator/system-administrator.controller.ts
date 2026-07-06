import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SystemAdministratorService } from './system-administrator.service';
import { CreateSystemAdministratorDto } from './dto/create-system-administrator.dto';
import { UpdateSystemAdministratorDto } from './dto/update-system-administrator.dto';

@Controller('system-administrator')
export class SystemAdministratorController {
  constructor(
    private readonly systemAdministratorService: SystemAdministratorService,
  ) {}

  @Post()
  create(@Body() createSystemAdministratorDto: CreateSystemAdministratorDto) {
    return this.systemAdministratorService.create(createSystemAdministratorDto);
  }

  @Get()
  findAll() {
    return this.systemAdministratorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.systemAdministratorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSystemAdministratorDto: UpdateSystemAdministratorDto,
  ) {
    return this.systemAdministratorService.update(
      +id,
      updateSystemAdministratorDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.systemAdministratorService.remove(+id);
  }
}
