import { Module } from '@nestjs/common';
import { SystemAdministratorService } from './system-administrator.service';
import { SystemAdministratorController } from './system-administrator.controller';

@Module({
  controllers: [SystemAdministratorController],
  providers: [SystemAdministratorService],
})
export class SystemAdministratorModule {}
