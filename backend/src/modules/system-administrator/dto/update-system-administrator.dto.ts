import { PartialType } from '@nestjs/mapped-types';
import { CreateSystemAdministratorDto } from './create-system-administrator.dto';

export class UpdateSystemAdministratorDto extends PartialType(CreateSystemAdministratorDto) {}
